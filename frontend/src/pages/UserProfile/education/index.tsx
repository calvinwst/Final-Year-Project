import { useState, useContext, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Button,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import CustomModal from "../../../components/customModel";
import CustomButton from "../../../components/customButton";
import { AuthContext } from "../../../context/authContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { set } from "date-fns";
import axios from "axios";
import e from "express";

interface MedicalEducationDataProps {
  medicalEducationData: any;
  userId: any;
}

const MedicalEducation: React.FC<MedicalEducationDataProps> = ({
  medicalEducationData,
  userId,
}) => {
  const [addEducationData, setAddEducationData] = useState({
    medicalDegree: "",
    medicalSchool: "",
    residency: "",
    fellowship: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [medicalEducation, setMedicalEducation] = useState<any | []>([]); //this is the data that is being edited
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = useContext(AuthContext);
  const token = auth.token;
  const toast = useToast();

  //Call Get api to get the data for education user

  const fetchEducationData = () => {
    setIsLoading(true);
    axios
      .get(`http://localhost:4000/users/${userId}/education`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log("this is the res", res);
        setMedicalEducation(res.data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  //see the data of the selected education
  console.log("this is the data of medical education", medicalEducation);

  //call put api to edit the education data
  const handleSave = (educationId: string) => {
    console.log("this is the educationId", educationId);
    //call api to save
    setIsLoading(true);
    fetch(`http://localhost:4000/users/${userId}/education/${educationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(addEducationData),
    }).then((response) => {
      console.log("this is response", response);
      if (response.ok) {
        setIsLoading(false);
        setMedicalEducation((prevState: any[]) =>
          prevState.map((data: any) => {
            if (data._id === educationId) {
              return {
                ...data,
                ...addEducationData,
              };
            } else {
              return data;
            }
          })
        );
        onClose();
        toast({
          title: "Save successful!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Save failed!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    });
    onClose();
  };

  //Call api to add
  const handleAdd = () => {
    //call api to add
    setIsLoading(true);
    fetch(`http://localhost:4000/users/${userId}/education`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify([addEducationData]),
    }).then((response) => {
      console.log("this is response", response);
      setMedicalEducation([...medicalEducation, addEducationData]);
      if (response.ok) {
        onClose();
        setIsLoading(false);
        toast({
          title: "Add successful!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Add failed!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    });
    onClose();
  };

  //handle change for add education and edit education
  const handleAddChange = (event: any) => {
    setAddEducationData({
      ...addEducationData,
      [event.target.id]: event.target.value,
    });
    console.log("this is the addEducationData", addEducationData);
    console.log("this is the addEducationData type", typeof addEducationData);
  };

  //Call api to delete
  const handleDelete = (educationId: string) => {
    setIsLoading(true);
    //call api to delete
    fetch(`http://localhost:4000/users/${userId}/education/${educationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      console.log("this is response", response);
      if (response.ok) {
        onClose();
        setIsLoading(false);
        setMedicalEducation(
          medicalEducation.filter((data: any) => data._id !== educationId)
        );
        toast({
          title: "Delete successful!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Delete failed!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    });
    onClose();
  };

  //create a function to handle the edit
  const handleEdit = (educationId: string, data: any) => {
    setSelectedData(data);
  };

  const colorTitle = useColorModeValue("blue.600", "blue.300");
  const color = useColorModeValue("gray.600", "gray.400");
  return (
    <>
      <Box>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Heading as="h2" size="md">
            Medical Education
          </Heading>
          <IconButton
            aria-label="Add Medical Education"
            icon={<AddIcon />}
            onClick={() => onOpen()}
          />
        </Flex>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {medicalEducation.map((data: any) => {
              return (
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  mb={4}
                  _hover={{ bg: "gray.50" }}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box flex="1" pr={4}>
                      <Heading size="md" mb={2} color={colorTitle}>
                        {data.medicalDegree}
                      </Heading>
                    </Box>
                    <Flex alignItems="center">
                      <Tooltip label="Edit Medical Education">
                        <IconButton
                          aria-label="Edit Medical Education"
                          mr={2}
                          icon={<EditIcon />}
                          onClick={() => {
                            handleEdit(data._id, data);
                            setIsEdit(true);
                            setIsAdd(false);
                            onOpen();
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Medical Education">
                        <IconButton
                          aria-label="Delete Medical Education"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            console.log("this is the data in delete", data);
                            console.log(
                              "this is the data.userId in delete>>>",
                              data._id
                            );
                            handleDelete(data._id);
                          }}
                        />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  <Box flex="1" pr={4}>
                    {data.medicalSchool ||
                    data.residency ||
                    data.fellowship ||
                    data.boardCertification ? (
                      <>
                        {data.medicalSchool && (
                          <Text fontSize="sm" mb={2} color={color}>
                            Medical School: <b>{data.medicalSchool}</b>
                          </Text>
                        )}
                        {data.residency && (
                          <Text fontSize="sm" mb={2} color={color}>
                            Residency: <b>{data.residency}</b>
                          </Text>
                        )}
                        {data.fellowship && (
                          <Text fontSize="sm" mb={2} color={color}>
                            Fellowship: <b>{data.fellowship}</b>
                          </Text>
                        )}
                        {data.boardCertification && (
                          <Text fontSize="sm" mb={2} color={color}>
                            Board Certification:{" "}
                            <b>{data.boardCertification}</b>
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text fontSize="sm" mb={2} color={color}>
                        No education details available.
                      </Text>
                    )}
                  </Box>
                </Box>
              );
            })}
          </>
        )}
        <CustomModal
          isOpen={isOpen}
          onClose={onClose}
          title={isEdit ? "Edit Medical Education" : "Add Medical Education"}
          body={
            <Box>
              <FormControl id="medicalDegree">
                <FormLabel>Medical Degree</FormLabel>
                <Input
                  placeholder="Medical Degree"
                  defaultValue={isEdit ? selectedData?.medicalDegree : null}
                  onChange={handleAddChange}
                />
              </FormControl>
              <FormControl id="medicalSchool">
                <FormLabel>Medical School</FormLabel>
                <Input
                  placeholder="Medical School"
                  defaultValue={isEdit ? selectedData?.medicalSchool : null}
                  onChange={handleAddChange}
                />
              </FormControl>
              <FormControl id="residency">
                <FormLabel>Residency</FormLabel>
                <Input
                  placeholder="Residency"
                  defaultValue={isEdit ? selectedData?.residency : null}
                  onChange={handleAddChange}
                />
              </FormControl>
              <FormControl id="fellowship">
                <FormLabel>Fellowship</FormLabel>
                <Input
                  placeholder="Fellowship"
                  defaultValue={isEdit ? selectedData?.fellowship : null}
                  onChange={handleAddChange}
                />
              </FormControl>
            </Box>
          }
          footer={
            <Flex justifyContent="flex-end">
              <CustomButton
                onClick={onClose}
                text="Cancel"
                mr={4}
                type={"button"}
              />
              <CustomButton
                onClick={
                  isEdit ? () => handleSave(selectedData?._id) : handleAdd
                }
                text="Save"
                type={"button"}
                color="blue"
              />
            </Flex>
          }
        />
      </Box>
    </>
  );
};

export default MedicalEducation;
