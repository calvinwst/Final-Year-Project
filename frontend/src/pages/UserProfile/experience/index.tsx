import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,   
  Text,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { EditIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import CustomModal from "../../../components/customModel";
import CustomButton from "../../../components/customButton";
import LoadingSpinner from "../../../components/LoadingSpinner";
import axios from "axios";
import { set } from "date-fns";

// import { format } from "date-fns";
interface ExperienceSectionProps {
  experienceData: any;
  userId: any;
  token: any | string;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experienceData,
  userId,
  token
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataExperience, setDataExperience] = useState<any | []>([]);
  const [isAdd, setIsAdd] = useState(false);
  const [experienceNewData, setExperienceData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  //call get api to get experience data
  useEffect(()=>{
    fetchExperienceData();
  }, [])

  

  console.log("this is the experience data", experienceData);
  console.log("this is the token in experience", token);
  console.log("this is the userId in experience", dataExperience);

  // handle change for edit
  const handleExperienceChange = (event: any) => {
    setExperienceData({
      ...experienceNewData,
      [event.target.id]: event.target.value,
    });
    console.log("this is the experienceData", experienceData);
    console.log("this is the experienceData type", typeof experienceData);
  };

  //handle edit
  const handleEdit = (experience: any) => {
    console.log("this is the experience", experience);
    setSelectedData(experience);
    onOpen();
  };

  const fetchExperienceData = () => {
    setIsLoading(true);
    axios.get(`http://localhost:4000/users/${userId}/experience`, {
      headers: {
        "Authorization" : "Bearer " + token,
      },
    }).then((res) => {
      console.log("this is the experience data", res.data);
      setDataExperience(res.data);
      setIsLoading(false);
    });
  }

  //call put api
  const handleSave = (educationId: string) => {
    console.log("this is the educationId", educationId);
    //call api to save
    setIsLoading(true);
    fetch(
      `http://localhost:4000/users/${userId}/experience/${educationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token,

        },
        body: JSON.stringify(experienceNewData),
      }
    ).then((response) => {
      console.log("this is response", response);
      if (response.ok) {
        setIsLoading(false)
        setDataExperience(dataExperience.map((data: any) => {
          if (data._id === educationId) {
            return {
              ...data,
              ...experienceNewData,
            };
          }
          return data;
        }
        ));
        onClose();
        alert("Save successful!");
      } else {
        alert("Save failed!");
      }
    });
    onClose();
  };

  //delete api
  const handleDelete = (experienceId: string) => {
    setIsLoading(true);
    console.log("this is the experienceId", experienceId);
    fetch(
      `http://localhost:4000/users/${userId}/experience/${experienceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token,

        },
      }
    ).then((response) => {
      console.log("this is response", response);
      if (response.ok) {
        onClose();
        setIsLoading(false);
        setDataExperience(dataExperience.filter((data: any) => data._id !== experienceId));
        alert("Delete successful!");
      } else {
        alert("Delete failed!");
      }
    });
  };

  //call post api
  const handleAdd = () => {
    setIsLoading(true);
    fetch(`http://localhost:4000/users/${userId}/experience`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token,

      },
      body: JSON.stringify([experienceNewData]),
    }).then((response) => {
      console.log("this is response", response);
      setDataExperience([...dataExperience, experienceNewData]);
      if (response.ok) {
        onClose();
        setIsLoading(false);
        alert("Save successful!");
      } else {
        alert("Save failed!");
      }
    });
  };



  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Experience</Heading>
        <IconButton
          aria-label="Add experience"
          icon={<AddIcon />}
          onClick={
            () => {
              setIsEdit(false);
              setIsAdd(true);
              onOpen();
            }
          }
        />
      </Flex>

      {
        isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {
              dataExperience.map((data: any) => {
                return (
                  <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} mt={2}>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                      mt={2}
                    >
                      <Heading size="md">{data.title}</Heading>
                      <IconButton
                        aria-label="Edit experience"
                        icon={<EditIcon />}
                        onClick={() => {
                          // i should pass the id here
                          handleEdit(data);
                          setIsEdit(true);
                          setIsAdd(false);
                          onOpen();
                        }}
                      />
                      <IconButton
                        aria-label="Delete experience"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(data._id)}
                      />
                    </Flex>
                    <Text fontSize="sm" mb={2}>
                      Hospital: {data.company}
                    </Text>
                    <Text fontSize="sm">Location: {data.location}</Text>
                    <Text fontSize="sm">Description: {data.description}</Text>
                    <Text fontSize="sm">
                      Duration: 
                      {new Date(data.startDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(data.endDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                  </Box>
                );
              })
            }
          </>
        )
      }

      {/* {experienceData.map((data: any) => {
        return (
          <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} mt={2}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              mt={2}
            >
              <Heading size="md">{data.title}</Heading>
              <IconButton
                aria-label="Edit experience"
                icon={<EditIcon />}
                onClick={() => {
                  // i should pass the id here
                  handleEdit(data);
                  setIsEdit(true);
                  setIsAdd(false);
                  onOpen();
                }}
              />
              <IconButton
                aria-label="Delete experience"
                icon={<DeleteIcon />}
                onClick={() => handleDelete(data._id)}
              />
            </Flex>
            <Text fontSize="sm" mb={2}>
              Hospital: {data.company}
            </Text>
            <Text fontSize="sm">Location: {data.location}</Text>
            <Text fontSize="sm">Description: {data.description}</Text>
            <Text fontSize="sm">
              Duration: 
              {new Date(data.startDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(data.endDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </Box>
        );
      })} */}
      {
        <CustomModal
          isOpen={isOpen}
          onClose={onClose}
          title={isEdit ? "Edit Experience" : "Add Experience"}
          body={
            <>
              <Box>
                <FormControl id="title">
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    placeholder="Title"
                    defaultValue={isEdit ? selectedData?.title : null}
                    onChange={handleExperienceChange}
                  />
                </FormControl>
                <FormControl id="company">
                  <FormLabel>Hospital</FormLabel>
                  <Input
                    type="text"
                    placeholder="Company"
                    defaultValue={isEdit ? selectedData?.company : null}
                    onChange={handleExperienceChange}
                  />
                </FormControl>
                <FormControl id="location">
                  <FormLabel>Location</FormLabel>
                  <Input
                    type="text"
                    placeholder="Location"
                    defaultValue={isEdit ? selectedData?.location : null}
                    onChange={handleExperienceChange}
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    placeholder="Description"
                    defaultValue={isEdit ? selectedData?.description : null}
                    onChange={handleExperienceChange}
                  />
                </FormControl>
                <FormControl id="startDate">
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    placeholder="Start Date"
                    defaultValue={isEdit ? selectedData?.startDate : null}
                    onChange={handleExperienceChange}
                  />
                </FormControl>
                <FormControl id="endDate">
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    placeholder="End Date"
                    defaultValue={isEdit ? selectedData?.endDate : null}
                    onChange={handleExperienceChange}
                  />
                </FormControl>
              </Box>
            </>
          }
          footer={
            <>
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
                  text={isEdit ? "Save" : "Add"}
                  type={"button"}
                  color="blue"
                />
              </Flex>
            </>
          }
        />
      }
    </Box>
  );
};

export default ExperienceSection;
