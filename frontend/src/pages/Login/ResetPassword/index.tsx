import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Flex,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  //   const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // API call to send reset password email
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "An error occurred.",
        description: "Passwords do not match.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }
    try {
      // await sendResetPasswordEmail(email);
      console.log("this is the id", id);
      const response = await axios.put(
        `http://localhost:4000/auth/reset-password/${id}`,
        {
          password: newPassword,
        }
      );
      console.log(response);

      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to send reset password email. Please try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Flex align="center" justify="center" h="100vh">
      <Box maxW="md" borderWidth="1px" borderRadius="lg" p={5} boxShadow="lg">
        <Heading mb={4} textAlign="center">
          Reset Password
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"} mb={6} textAlign="center">
          Enter your new password.
        </Text>

        <Stack spacing={4}>
          <FormControl id="password" isRequired>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm your new password"
            />
          </FormControl>
          <Button
            colorScheme="blue"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Reset Password
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default ResetPassword;
