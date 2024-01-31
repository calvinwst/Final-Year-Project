import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  Stack,
  Flex,
  Avatar,
  FormControl,
  Divider,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "../../context/authContext";

interface UserProfile {
  profileImgPath: any;
  firstName: string;
  lastName: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat?: boolean;
  chatImgPath?: string;
}
export interface User {
  _id: string | undefined;
  username: string;
  password: string;
  profile: UserProfile;
}

export interface Messages {
  _id: string;
  chat: Chat;
  sender: User;
  content: string;
  readBy: User[];
  createdAt: string;
  updatedAt: string;
}

interface MessageProps {
  socket?: Socket | null;
  message: Messages[];
  users: User[];
  _id: string;
  setMessages?: React.Dispatch<React.SetStateAction<Messages[]>>;
  addNewMessage?: (message: Messages) => void;
  chatImgPath?: string;
}

const Message: React.FC<MessageProps> = ({
  message,
  users,
  _id,
  socket,
  chatImgPath,
  setMessages,
  addNewMessage,
}) => {
  console.log("this is chatImgPath >>> ", chatImgPath);
  // console.log("this is message in child>>>>>> ", message);
  // console.log("this is users >>>>>> ", users);
  // console.log("this is _id >>>>>> ", _id);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId } = React.useContext(AuthContext);
  const socketRef = useRef<any>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   const newSocket = io("http://localhost:4000");
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.close();
  //   };
  // }, []);

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const sendMessage = () => {
    if (socket && currentMessage.trim()) {
      socket.emit("sendMessage", {
        chatId: _id,
        content: currentMessage,
        senderId: userId, // Make sure this is the correct ID format
      });
      setCurrentMessage("");
    }
  };

  //   let avatarUrl = `http://localhost:4000/${users[0].profile.profileImgPath}`;

  // const groupChatMessage = message.find((msg) => msg.chat?.isGroupChat);
  // if (groupChatMessage) {
  //   avatarUrl = `http://localhost:4000/${groupChatMessage.chat?.chatImgPath}`;
  // }

  const otherUser = users.find((user) => user._id !== userId);

  return (
    <>
      <VStack
        w="100%"
        h="full"
        p="4"
        spacing="4"
        align="stretch"
        bg="gray.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
      >
        {users.length > 0 && (
          <>
            <Box p={2} bg="gray.200" rounded="md">
              <Stack direction="row" spacing="2" align="center">
                <Avatar
                  size="sm"
                  name={otherUser?.profile.firstName}
                  src={
                    users.length > 2
                      ? `http://localhost:4000/${chatImgPath}`
                      : `http://localhost:4000/${otherUser?.profile.profileImgPath}`
                  }
                />
                <Text fontWeight="bold" fontSize="lg">
                  {users.length > 2 ? (
                    <>
                      {users[0].profile.firstName} {users[0].profile.lastName}{" "}
                      and {users.length - 1} others
                    </>
                  ) : (
                    <>
                      {/* {users[0].profile.firstName} {users[0].profile.lastName}{" "} */}
                      {otherUser?.profile.firstName}{" "}
                      {otherUser?.profile.lastName}{" "}
                    </>
                  )}
                </Text>
              </Stack>
            </Box>
            <Divider />
          </>
        )}

        {/* Message area */}
        {users.length > 0 ? (
          <Flex flex="1" direction="column" overflowY="auto" px="3" h="full">
            {/* Messages will be displayed here */}
            {message.map((msg, index) => (
              <Flex
                key={index}
                direction="column"
                align={msg.sender._id === userId ? "flex-end" : "flex-start"}
                mb={3}
              >
                <Flex
                  align="center"
                  maxW="sm"
                  bg={msg.sender._id === userId ? "blue.500" : "gray.100"}
                  color={msg.sender._id === userId ? "white" : "gray.900"}
                  px={4}
                  py={3}
                  rounded="lg"
                >
                  {msg.sender._id !== userId && (
                    <Avatar
                      size="sm"
                      name={msg.sender.profile.firstName}
                      src={`http://localhost:4000/${msg.sender.profile.profileImgPath}`}
                      mr={4}
                    />
                  )}
                  <Text fontSize="sm">{msg.content}</Text>
                </Flex>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {msg.sender.profile.firstName} {msg.sender.profile.lastName}
                </Text>
              </Flex>
            ))}
          </Flex>
        ) : (
          <>
            <Flex
              flex="1"
              direction="column"
              align="center"
              justify="center"
              color="gray.500"
              px="3"
            >
              <Text fontWeight="bold" fontSize="lg">
                Select a chat to start messaging
              </Text>
            </Flex>
          </>
        )}

        {/* Message input */}

        {users.length > 0 && (
          <Flex as="form" onSubmit={(e) => e.preventDefault()}>
            <FormControl as={Flex} direction="row">
              <Input
                placeholder="Type your message here..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                bg="white"
                border="2px solid"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.500" }}
                rounded="lg"
              />
              <Button
                ml={2}
                onClick={sendMessage}
                colorScheme="blue"
                px="8"
                rounded="lg"
                disabled={!currentMessage.trim()}
              >
                Send
              </Button>
            </FormControl>
          </Flex>
        )}
      </VStack>
    </>
  );
};

export default Message;
