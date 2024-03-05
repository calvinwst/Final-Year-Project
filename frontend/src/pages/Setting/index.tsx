import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  useColorModeValue,
  useColorMode,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toast = useToast();
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();
  const userId = auth.userId;
  const emailToken = localStorage.getItem("emailToken");
  console.log("this is the userId", userId);
  console.log("this is the emailToken", emailToken);
  const handleEmailVerification = () => {
    console.log("Email verification clicked");

    // call api to send email verification
    axios
      .get(`http://localhost:4000/auth/verify-email/${emailToken}`)
      .then((res) => {
        console.log(res);
        toast({
          title: "Email Verification",
          description: "Email verification link has been sent to your email.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error.",
        description: "New password and confirm password do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Handle password change
      //   console.log("Changing password");
      // call api to change password
      axios
        .put(`http://localhost:4000/auth/reset-password/${userId}`, {
          password: newPassword,
        })
        .then((response) => {
          console.log(response);
          toast({
            title: "Password Reset",
            description: "Your password has been reset successfully.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          //   navigate("/login");
        });
    }
  };

  //   console.log("this is currentPassword", currentPassword);
  console.log("this is newPassword", newPassword);

  return (
    <>
      <Container maxW="container.xl" mt={16}>
        <Heading as="h1" size="xl" mt={6} mb={6} textAlign="center">
          Settings
        </Heading>
        <Box
          p={5}
          bg={useColorModeValue("gray.100", "gray.300")}
          mt={4}
          borderRadius="lg"
        >
          <Heading as="h2" size="lg" mb={6}>
            Change Password
          </Heading>
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <FormControl id="currentPassword" isRequired>
                <FormLabel>Current Password</FormLabel>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </FormControl>
              <FormControl id="newPassword" isRequired>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormControl>
              <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="blue" size="md" mt={2}>
                Change Password
              </Button>
            </form>
          </Stack>
        </Box>
        <Box borderWidth={1} borderRadius="lg" p={6} mt={5} boxShadow={"md"}>
          <Heading as="h2" size="md" mb={4}>
            Email Verification
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Your email is not verified. Please verify your email to access all
            the features.
          </Text>
          <Button
            colorScheme="blue"
            size="md"
            mt={4}
            onClick={handleEmailVerification}
          >
            Verify Email
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Setting;
