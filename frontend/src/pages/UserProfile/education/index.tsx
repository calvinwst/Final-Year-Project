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
        setMedicalEducation((prevState: any[]) => prevState.map((data: any) => {
          if(data._id === educationId) {
            return {
              ...data,
              ...addEducationData
            }
          } else {
            return data;
          }
        }
        ))
        onClose();
        alert("Save successful!");
      } else {
        alert("Save failed!");
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
        alert("Add successful!");
      } else {
        alert("Add failed!");
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
        alert("Delete successful!");
      } else {
        alert("Delete failed!");
      }
    });
    onClose();
  };

  //create a function to handle the edit
  const handleEdit = (educationId: string, data: any) => {
    setSelectedData(data);
  };

  return (
    <>
      <Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb="auto"
          mt={2}
        >
          <Heading as="h2" size="md" mb={2}>
            Medical Education
          </Heading>
          <IconButton
            aria-label="Add Medical Education"
            icon={<AddIcon />}
            onClick={() => {
              setIsEdit(false);
              setIsAdd(true);
              onOpen();
            }}
          />
        </Flex>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* {medicalEducationData.map((data: any) => {
              return (
                <Box borderWidth="1px" borderRadius="lg" p={2} mb={4} mt={4}>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Heading size="md">{data.medicalDegree}</Heading>
                    <IconButton
                      aria-label="Edit Medical Education"
                      icon={<EditIcon />}
                      onClick={() => {
                        // i should pass the id here
                        handleEdit(data._id, data);
                        setIsEdit(true);
                        setIsAdd(false);
                        onOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete Medical Education"
                      icon={<DeleteIcon />}
                      onClick={() => {
                        console.log("this is the data", data);
                        handleDelete(data.userId, data.id);
                      }}
                    />
                  </Flex>
                  <Box>
                    <Text fontSize="sm" mb={2}>
                      Medical School: {data.medicalSchool}
                    </Text>
                    <Text fontSize="sm" mb={2}>
                      Residency: {data.residency}
                    </Text>
                    <Text fontSize="sm" mb={2}>
                      Fellowship: {data.fellowship}
                    </Text>
                    <Text fontSize="sm" mb={2}>
                      {data.boardCertification}
                    </Text>
                  </Box>
                </Box>
              );
            })} */}
            {medicalEducation.map((data: any) => {
              return (
                <Box borderWidth="1px" borderRadius="lg" p={2} mb={4} mt={4}>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Heading size="md">{data.medicalDegree}</Heading>
                    <IconButton
                      aria-label="Edit Medical Education"
                      icon={<EditIcon />}
                      onClick={() => {
                        // i should pass the id here
                        handleEdit(data._id, data);
                        setIsEdit(true);
                        setIsAdd(false);
                        onOpen();
                      }}
                    />
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
                  </Flex>
                  <Box>
                    <Text fontSize="sm" mb={2}>
                      Medical School: {data.medicalSchool}
                    </Text>
                    <Text fontSize="sm" mb={2}>
                      Residency: {data.residency}
                    </Text>
                    <Text fontSize="sm" mb={2}>
                      Fellowship: {data.fellowship}
                    </Text>
                    <Text fontSize="sm" mb={2}>
                      {data.boardCertification}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </>
        )}
        {/* {medicalEducationData.map((data: any) => {
          return (
            <Box borderWidth="1px" borderRadius="lg" p={2} mb={4} mt={4}>
              <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Heading size="md">{data.medicalDegree}</Heading>
                <IconButton
                  aria-label="Edit Medical Education"
                  icon={<EditIcon />}
                  onClick={() => {
                    // i should pass the id here
                    handleEdit(data._id, data);
                    setIsEdit(true);
                    setIsAdd(false);
                    onOpen();
                  }}
                />
                <IconButton
                  aria-label="Delete Medical Education"
                  icon={<DeleteIcon />}
                  onClick={() => {
                    console.log("this is the data", data);
                    handleDelete(data.userId, data.id);
                  }}
                />
              </Flex>
              <Box>
                <Text fontSize="sm" mb={2}>
                  Medical School: {data.medicalSchool}
                </Text>
                <Text fontSize="sm" mb={2}>
                  Residency: {data.residency}
                </Text>
                <Text fontSize="sm" mb={2}>
                  Fellowship: {data.fellowship}
                </Text>
                <Text fontSize="sm" mb={2}>
                  {data.boardCertification}
                </Text>
              </Box>
            </Box>
          );
        })} */}
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
