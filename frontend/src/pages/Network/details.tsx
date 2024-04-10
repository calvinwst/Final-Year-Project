import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  Button,
  useColorModeValue,
  HStack,
  VStack,
  Avatar,
  Heading,
  Tag,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { request } from "http";
import { useNavigate } from "react-router-dom";

const NetworkDetails = () => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const token = auth.token;

  const toast = useToast();

  const { networkId } = useParams<{ networkId: string }>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [connectionRequestId, setConnectionRequestId] = useState<any>("");
  const [networkData, setNetworkData] = React.useState<any>({
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
  const bg = useColorModeValue("white", "gray.700");
  const navigate = useNavigate();
  const fetchAndCheckPendingRequests = () => {
    axios
      .get(`http://localhost:4000/connection/pending`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        const pendingRequests = response.data.pendingRequests;
        // Check if the current user has a pending request to the profile
        const pendingRequest = pendingRequests.find(
          (request: any) => request.requester._id.toString() === networkId
        );
        console.log("Pending request id: before --", pendingRequest._id);
        if (pendingRequest) {
          setConnectionRequestId(pendingRequest._id);
          console.log("connectionRequestIdid: after --", connectionRequestId);
        }
      })
      .catch((err) => {
        console.log("this is error in fetchAndCheckPendingRequests >>>> ", err);
      });
  };

  useEffect(() => {
    fetchUserDetail();
    fetchAndCheckPendingRequests();
  }, [networkId, userId]);

  console.log("this is userId >>>", userId);
  console.log("this is networkId >>>", networkId);
  console.log("this is the connectionRequestId >>>", connectionRequestId);

  const fetchUserDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/${networkId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("this is response>>>", response.data);
      setLoading(false);
      setNetworkData(response.data);
    } catch (err) {
      console.log("Error fetching user details", err);
    }
  };

  const checkConnectionStatus = async () => {
    // Implementation for checking connection status
    try {
      const response = await axios.get(
        `http://localhost:4000/connection/status/${userId}/${networkId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setConnectionStatus(response.data.status);
    } catch (err) {
      console.log("Error fetching connection status", err);
    }
  };
  console.log("this is connectionStatus >>>", connectionStatus);

  useEffect(() => {
    // Check connection status
    checkConnectionStatus();
  }, [networkId, userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!networkData) {
    return <Text>No user data found.</Text>;
  }

  const handleConnect = (profileId: string) => {
    // Implementation for sending connection request
    console.log("this is profileId in handleConnect >>>> ", profileId);
    if (connectionStatus === "pending") {
      return console.log("Already sent a request");
    } else if (connectionStatus === "connected") {
      return console.log("Already connected");
    } else {
      axios
        .post(
          `http://localhost:4000/connection/request/${profileId}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          console.log("this is response in handleConnect >>>> ", response);
          console.log("Connection request sent");
          toast({
            title: "Connection request sent.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) => {
          //   console.log("this is error in handleConnect >>>> ", err);
          console.log("this is response.data.message >>>> ", err.response.data);
          toast({
            title: `Error sending connection request. ${err.response.data.message}`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const handleAccept = () => {
    // console.log("this is profileId in handleAccept >>>> ", profileId);
    axios
      .patch(
        `http://localhost:4000/connection/accept/${connectionRequestId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log("this is response in handleAccept >>>> ", response);
        console.log("Connection request accepted");
        toast({
          title: `Accepted Connection Request. ${networkData.username} is now in your network.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/network");
      })
      .catch((err) => {
        console.log("this is error in handleAccept >>>> ", err);
        toast({
          title: "Error accepting connection request.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleReject = () => {
    // console.log("this is profileId in handleReject >>>> ", profileId);
    axios
      .patch(
        `http://localhost:4000/connection/reject/${connectionRequestId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log("this is response in handleReject >>>> ", response);
        console.log("Connection request rejected");
        toast({
          title: "Rejected Connection.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log("this is error in handleReject >>>> ", err);
        toast({
          title: "Error rejecting connection request.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const profileImgPath = `http://localhost:4000/${networkData.profile.profileImgPath}`;

  return (
    <>
      {/* <Text>Network Details</Text> */}
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Box
          p={5}
          maxW="container.md"
          mx="auto"
          border="1px"
          borderColor="gray.300"
          boxShadow="lg"
          mt={16}
        >
          <VStack spacing={4} align="stretch">
            <Flex
              justifyContent="space-around"
              alignItems="center"
              width="100%"
            >
              <HStack spacing={4}>
                <Avatar
                  src={profileImgPath}
                  size="xl"
                  name={`${networkData.profile.firstName} ${networkData.profile.lastName}`}
                />
                <VStack align="start">
                  <Heading as="h2" size="lg">
                    {networkData.profile.firstName}{" "}
                    {networkData.profile.lastName}
                  </Heading>
                  <Text color="gray.500">{networkData.profile.location}</Text>
                </VStack>
              </HStack>
              {/* Conditional rendering for buttons, each button can be styled individually */}
              {connectionStatus === "connected" && (
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => {
                    /* click handler code */
                  }}
                >
                  Connected
                </Button>
              )}
              {connectionStatus === "accept" && (
                <>
                  <Button colorScheme="blue" onClick={handleAccept}>
                    Accept
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleReject}
                    ml={2} // Add margin left to separate buttons
                  >
                    Reject
                  </Button>
                </>
              )}
              {connectionStatus === "request" && (
                <Button
                  colorScheme="blue"
                  onClick={() => handleConnect(networkData._id)}
                >
                  Connect
                </Button>
              )}
            </Flex>
            <Box p={4} borderRadius="md">
              <Text fontSize="lg" mb={2}>
                About:
              </Text>
              <Text>{networkData.profile.about}</Text>
            </Box>
            <Box p={4} borderRadius="md">
              <Text fontSize="lg" mb={2}>
                Experience:
              </Text>
              <HStack spacing={2}>
                {networkData.experience.map((exp: any, index: any) => (
                  <Tag key={index} colorScheme="green">
                    {exp.title}
                  </Tag>
                ))}
              </HStack>
            </Box>
            <Box p={4} bg={bg} borderRadius="md">
              <Text fontSize="lg" mb={2}>
                Skills:
              </Text>
              <HStack spacing={2}>
                {networkData.skills.map((skill: any, index: any) => (
                  <Tag key={index} colorScheme="green">
                    {skill.name}
                  </Tag>
                ))}
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </>
  );
};

export default NetworkDetails;
