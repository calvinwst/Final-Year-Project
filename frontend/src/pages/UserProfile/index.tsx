import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Divider,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import AboutSection from "./about";
import EducationSection from "./education";
import ExperienceSection from "./experience";
import SkillSection from "./skills";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import CustomModal from "../../components/customModel";
import CustomButton from "../../components/customButton";
import { set } from "date-fns";

const UserProfile = () => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const token = auth.token;
  const toast = useToast();

  const [user, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    profile: {
      profileImgPath: "",
    },
    medicalEducation: [],
    experience: [],
    skills: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const profileImgPath = `http://localhost:4000/${user.profile.profileImgPath}`;

  const color = useColorModeValue("gray.600", "gray.400");

  const handleUploadImage = (e: any) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    // Determine whether to use PUT or PATCH based on whether the profile image exists
    const method = profileImgPath !== "" ? axios.put : axios.patch;
    const url = `http://localhost:4000/users/${userId}/image`;

    method(url, formData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log("Image updated successfully", res.data);
        // Update the user data in the state with the new image path
        setUserData((prevState) => ({
          ...prevState,
          profile: {
            ...prevState.profile,
            profileImgPath: res.data.profile.profileImgPath,
          },
        }));
        toast({
          title: "Profile picture updated.",
          description: "Your profile picture has been updated successfully.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log("Error updating image", err);
        toast({
          title: "Error updating profile picture.",
          description: "An error occurred while updating your profile picture.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const fetchUserData = () => {
    setLoading(true);
    axios
      .get(`http://localhost:4000/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("this is the resData", res.data);
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Box mt={16} p={5} maxW="5xl" mx="auto">
        {loading ? (
          <Center>
            <LoadingSpinner />
          </Center>
        ) : (
          <>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
            >
              <Avatar size="2xl" name={user.username} src={profileImgPath} />
              <Box
                flex="1"
                textAlign={{ base: "center", md: "left" }}
                ml={{ md: 6 }}
              >
                <Text fontWeight="bold" fontSize="xl">
                  {user.username}
                </Text>
                <Text color={color}>{user.email}</Text>
              </Box>
              <Button
                onClick={() => setIsModalOpen(true)}
                ml={{ base: 0, md: 6 }}
                mt={{ base: 4, md: 0 }}
              >
                Change Profile Picture
              </Button>
            </Flex>

            <Divider my={6} />

            <AboutSection
              aboutText="idk"
              profileData={user.profile}
              userId={userId}
              token={token}
            />
            <EducationSection
              medicalEducationData={user.medicalEducation}
              userId={userId}
            />
            <ExperienceSection
              experienceData={user.experience}
              userId={userId}
              token={token}
            />
            <SkillSection skillsData={user.skills} userId={userId} />
          </>
        )}

        <CustomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Change Profile Picture"
          body={
            <FormControl>
              <FormLabel>Upload Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                border="none"
                onChange={handleUploadImage}
              />
            </FormControl>
          }
          footer={
            <Flex justify="end">
              <>
                <CustomButton
                  text="Cancel"
                  color="red"
                  type="button"
                  mr={3}
                  onClick={() => setIsModalOpen(false)}
                />
                <CustomButton
                  text="Save"
                  color="green"
                  type="submit"
                  onClick={() => setIsModalOpen(false)}
                />
              </>
            </Flex>
          }
        />
      </Box>
    </>
  );
};

export default UserProfile;
