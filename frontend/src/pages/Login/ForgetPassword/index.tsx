import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Stack,
  useToast,
  Flex,
  Text,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ca } from "date-fns/locale";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = () => {
    setIsSubmitting(true);
    sendEmail();
  };

  //caliiing the api to send the email
  const sendEmail = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/auth/reset-password-link",
        {
          email: email,
        }
      );
      console.log(response);
      toast({
        title: "Request Sent.",
        description:
          "If the email is in our system, you will receive a reset link.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitting(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Flex align="center" justify="center" h="100vh">
        <Box maxW="md" borderWidth="1px" borderRadius="lg" p={5} boxShadow="lg">
          <Heading mb={4} textAlign="center">
            Forget Password
          </Heading>
          <Text fontSize={"md"} color={"gray.600"} mb={6} textAlign="center">
            Enter your email to receive a password reset link.
          </Text>

          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<EmailIcon color="gray.300" />}
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </InputGroup>
            </FormControl>
            <Button
              colorScheme="blue"
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default ForgetPassword;
