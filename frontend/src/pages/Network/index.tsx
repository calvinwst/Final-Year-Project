import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Image,
  Text,
  Grid,
  Badge,
  Button,
  useColorModeValue,
  Divider,
  Flex,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import CustomGridLayout from "../../components/CustomGridLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import CustomListing from "../../components/customListing";

const Network = () => {
  const [network, setNetwork] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("this is network >>>", network);

  const imageFilePath = network.map((user: any) => {
    const image = user.profile
      ? `http://localhost:4000/${user.profile.profileImgPath}`
      : undefined;
    return image;
  });

  console.log("this is imageFilePath >>>", imageFilePath);

  const fetchProfileData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("this is the response", res.data);
      setNetwork(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <>
      <Box p={5} bg={useColorModeValue("gray.100", "gray.300")} mt={16}>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={5}>
          Network
        </Text>
        <Divider orientation="horizontal" mb={5} />
        {loading ? (
          <LoadingSpinner
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              margin: "0 auto",
            }}
          />
        ) : (
          <CustomGridLayout>
            {network.map((user: any) => (
              <CustomListing
                item={{
                  id: user._id,
                  title: user.username,
                  username: user.username,
                  email: user.email,
                  description: user.bio,
                  image: user.profile.profileImgPath,
                  tag: [
                    user.medicalEducation && user.medicalEducation.length > 0
                      ? user.medicalEducation[0].medicalSchool
                      : "N/A",
                    user.profile.location,
                    user.profile.specialty,
                  ],
                  verified:
                    user.emailVerification && user.emailVerification.verified
                      ? user.emailVerification.verified
                      : false,
                  // status: user.status,
                }}
                type="user"
              />
            ))}
          </CustomGridLayout>
        )}
      </Box>
    </>
  );
};

export default Network;
