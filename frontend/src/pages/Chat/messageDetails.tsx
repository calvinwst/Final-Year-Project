import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  VStack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "../../context/authContext";

const MessageDetails = () => {
  const { researchId } = useParams<{ researchId: string }>();
  const [message, setMessage] = useState("");
  const { userId, token } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      query: { token },
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && userId) {
      socket.emit("directMessage", {
        receiverId: researchId,
        senderId: userId,
        content: message,
      });
      setMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    navigate("/chat");
  };

  return (
    <>
      <Center py={6} mt={16}>
        <Box
          maxW={"500px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"md"}
          p={6}
          overflow={"hidden"}
        >
          <Heading fontSize={"2xl"} fontFamily={"body"} textAlign={"center"}>
            Message to Researcher/Author
          </Heading>
          <Divider my={4} />
          <VStack spacing={5}>
            {/* <form onSubmit={handleSubmit}> */}
            <FormControl id="message">
              <FormLabel>Write your message</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here"
                size="sm"
              />
            </FormControl>
            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              size="lg"
              onClick={sendMessage}
            >
              Send Message
            </Button>
            {/* </form> */}
          </VStack>
        </Box>
      </Center>
    </>
  );
};

export default MessageDetails;
