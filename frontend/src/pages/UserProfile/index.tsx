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

interface UserProfileProps {
  setShowNav?(showNav: boolean): void;
}

const UserProfile: React.FC<UserProfileProps> = ({ setShowNav }) => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const token = auth.token;
  // console.log("this is token in userprofile", token);
  // console.log("this is userId in userprofile", userId);

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
      setUserData(prevState => ({
        ...prevState,
        profile: {
          ...prevState.profile,
          profileImgPath: res.data.profile.profileImgPath
        }
      }));
    })
    .catch((err) => {
      console.log(err);
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
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="auto"
        width="100%"
        mt={16}
      >
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          maxWidth="auto"
          borderWidth="1px"
          borderRadius="lg"
          p={4}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Avatar
                size="2xl"
                name="Dan Abrahmov"
                // src="https://bit.ly/dan-abramov"
                // src={imagePath}
                src={profileImgPath}
                onError={
                  ((e: any) => {
                    e.currentTarget.src = "https://bit.ly/dan-abramov";
                  }) as () => void
                }
              />
              <Button mt={4} onClick={() => setIsModalOpen(true)}>
                Change Profile Picture
              </Button>

              <br />
              <AboutSection
                aboutText="idk"
                profileData={user.profile}
                userId={userId}
                token={token}
              />
              <Divider orientation={undefined} />
              <EducationSection
                medicalEducationData={user.medicalEducation}
                userId={userId}
              />
              <Divider orientation={undefined} />
              <ExperienceSection
                experienceData={user.experience}
                userId={userId}
                token={token}
              />
              <Divider orientation={undefined} />
              <SkillSection skillsData={user.skills} userId={userId} />
            </>
          )}
        </Flex>
      </Flex>
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Change Profile Picture"
        body={
          <>
            <FormControl id="image">
              <FormLabel mt={5}>Upload Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                border="none"
                // onChange={handleImageChange}
                onChange={handleUploadImage}
              />
            </FormControl>
          </>
        }
        footer={
          <>
            <CustomButton
              text="Cancel"
              // colorScheme="red"
              color="red"
              type="button"
              mr={3}
              onClick={() => setIsModalOpen(false)}
            />
            <CustomButton
              text="Save"
              // colorScheme="green"
              color="green"
              type="submit"
              onClick={() => setIsModalOpen(false)}
            />
          </>
        }
      />
    </>
  );
};

export default UserProfile;
