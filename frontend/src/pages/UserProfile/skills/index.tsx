import React, { useState, useContext, useEffect } from "react";
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
  Select,
} from "@chakra-ui/react";
import CustomModal from "../../../components/customModel";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import CustomButton from "../../../components/customButton";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import { is } from "date-fns/locale";
import { set } from "date-fns";

interface SkillProps {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface SkillDataProps {
  skillsData: any;
  userId: any;
}

const SkillSection: React.FC<SkillDataProps> = ({ skillsData, userId }) => {
  const [skillData, setSkillData] = useState({
    name: "",
    level: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [addSkill, setAddSkill] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataSkill, setDataSkill] = useState<any | []>([]);
  const auth = useContext(AuthContext);
  const token = auth.token;

  useEffect(()=>{
    fetchDataSkill();
  }, [])

  const fetchDataSkill = ()=>{
    axios.get(`http://localhost:4000/users/${userId}/skills`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      setDataSkill(res.data);
      console.log("this is data skill", dataSkill);
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
  const handleChange = (event: any) => {
    setSkillData({ ...skillData, [event.target.id]: event.target.value });
    console.log("this is the skill data", skillData);
  };

  const handleSave = (skillId: string) => {
    setIsLoading(true);
    //call api to save
    fetch(`http://localhost:4000/users/${userId}/skills/${skillId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify(skillData),
    }).then((response) => {
      setDataSkill(
        dataSkill.map((data: any) =>
          data._id === skillId ? { ...data, ...skillData } : data
        )
      );
      if (response.ok) {
        onClose();
        setIsLoading(false);
        alert("Edit successful!");
      } else {
        alert("Edit failed!");
      }
    });
  };

  const handleDelete = (skillId: string) => {
    //call api to delete
    setIsLoading(true);
    fetch(`http://localhost:4000/users/${userId}/skills/${skillId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    }).then((response) => {
      console.log("this is response", response);
      setDataSkill(dataSkill.filter((data: any) => data._id !== skillId));
      if (response.ok) {
        onClose();
        setIsLoading(false);
        alert("Delete successful!");
      } else {
        alert("Delete failed!");
      }
    });
    onClose();
  };

  const handleEdit = (data: any) => {
    //call api to edit
    setSelectedData(data);
    onClose();
  };

  const handleAdd = () => {
    //call api to add
    setIsLoading(true);
    fetch(`http://localhost:4000/users/${userId}/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token,
      },
      body: JSON.stringify(skillData),
    }).then((response) => {
      console.log("this is response", response);
      setDataSkill([...dataSkill, skillData]);
      if (response.ok) {
        onClose();
        setIsLoading(false);

        alert("Save successful!");
      } else {
        alert("Save failed!");
      }
    });

    onClose();
  };

  return (
    <>
      {isLoading ? (
        <>
          <LoadingSpinner />
        </>
      ) : (
        <Box>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading size="md">Skill</Heading>
            <IconButton
              aria-label="Add Skill"
              icon={<AddIcon />}
              onClick={() => {
                setAddSkill(true);
                setIsEdit(false);
                onOpen();
              }}
            />
          </Flex>
          {/* {skillsData.map((data: any) => {
            return (
              <Box mt={4} borderWidth="1px" borderRadius="lg" p={4}>
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                  <Heading size="md">{data.name}</Heading>
                  <IconButton
                    aria-label="Edit Skill"
                    icon={<EditIcon />}
                    onClick={() => {
                      handleEdit(data);
                      setIsEdit(true);
                      setAddSkill(false);
                      onOpen();
                    }}
                  />
                  <IconButton
                    aria-label="Delete Skill"
                    icon={<DeleteIcon />}
                    onClick={
                      () => handleDelete(data._id)
                      // () => handleDelete(data._id)
                    }
                  />
                </Flex>
                <Text fontSize="sm" mb={2}>
                  {data.level}
                </Text>
              </Box>
            );
          })} */}
          {
            isLoading ? (
              <LoadingSpinner />
            ) : (
              dataSkill.map((data: any) => {
                return (
                  <Box mt={4} borderWidth="1px" borderRadius="lg" p={4}>
                    <Flex justifyContent="space-between" alignItems="center" mb={2}>
                      <Heading size="md">{data.name}</Heading>
                      <IconButton
                        aria-label="Edit Skill"
                        icon={<EditIcon />}
                        onClick={() => {
                          handleEdit(data);
                          setIsEdit(true);
                          setAddSkill(false);
                          onOpen();
                        }}
                      />
                      <IconButton
                        aria-label="Delete Skill"
                        icon={<DeleteIcon />}
                        onClick={
                          () => handleDelete(data._id)
                          // () => handleDelete(data._id)
                        }
                      />
                    </Flex>
                    <Text fontSize="sm" mb={2}>
                      {data.level}
                    </Text>
                  </Box>
                );
              })
            )
          }
        </Box>
      )}

      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? "Edit Skill" : "Add Skill"}
        body={
          <Box>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                defaultValue={isEdit ? selectedData?.name : ""}
                onChange={handleChange}
              />
            </FormControl>
            <FormLabel>Level</FormLabel>
            <Select
              placeholder="Select option"
              onChange={handleChange}
              id="level"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </Select>
          </Box>
        }
        footer={
          <Flex justifyContent="flex-end">
            <CustomButton
              type="button"
              text="Cancel"
              onClick={onClose}
              mr={4}
            />
            <CustomButton
              onClick={isEdit ? () => handleSave(selectedData?._id) : handleAdd}
              color="blue"
              type="button"
              text={isEdit ? "Save" : "Add"}
            />
            {/* <Button onClick={onClose} mr={4}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={ isEdit ?}>
              {isEdit ? "Save" : "Add"}
            </Button> */}
          </Flex>
        }
      />

      {/* {isEdit === true ? (
        <CustomModal
          isOpen={isOpen}
          onClose={onClose}
          title="Edit Skill"
          body={
            <Box>
              <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  
                />
              </FormControl>
              <FormLabel>Level</FormLabel>
              <Select
                placeholder="Select option"
                onChange={(event) =>
                  setSkillData({
                    ...skillData,
                    level: event.target.value as SkillProps["level"],
                  })
                }
              >
                <option value="">Please Select</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </Select>
            </Box>
          }
          footer={
            <Flex justifyContent="flex-end">
              <Button onClick={onClose} mr={4}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Save
              </Button>
            </Flex>
          }
        />
      ) : (
        <CustomModal
          isOpen={isOpen}
          onClose={onClose}
          title="Add Skill"
          body={
            <Box>
              <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  defaultValue={skillData.name}
                  onChange={handleChange}
                />
                <FormLabel>Level</FormLabel>
                <Select
                  placeholder="Select option"
                  onChange={(event) =>
                    setSkillData({
                      ...skillData,
                      level: event.target.value as SkillProps["level"],
                    })
                  }
                >
                  <option value="">Please Select</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </Select>
              </FormControl>
            </Box>
          }
          footer={
            <Flex justifyContent="flex-end">
              <Button onClick={onClose} mr={4}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleAdd}>
                Add
              </Button>
            </Flex>
          }
        />
      )} */}
    </>
  );
};

export default SkillSection;
