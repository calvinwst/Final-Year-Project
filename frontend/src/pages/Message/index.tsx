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
  Link,
  Spacer,
  MenuButton,
  Menu,
  MenuList,
  IconButton,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import { RxExit } from "react-icons/rx";
import { AuthContext } from "../../context/authContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { is } from "date-fns/locale";
import axios from "axios";

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
  msg: any;
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
  chatImgPath?: string;
  isGroupChat?: boolean;
  fetchMessageDetails: () => Promise<void>; // Add this line
}

const Message: React.FC<MessageProps> = ({
  message,
  users,
  _id,
  socket,
  chatImgPath,
  isGroupChat,
  fetchMessageDetails,
}) => {
  console.log("this is chatImgPath >>> ", chatImgPath);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId } = React.useContext(AuthContext);
  const socketRef = useRef<any>();
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const leaveChat = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/chat/${_id}/leave/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast({
        title: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchMessageDetails();
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: "Unable to leave chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(err);
    }
  };

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
                      {otherUser?.profile.firstName}{" "}
                      {otherUser?.profile.lastName}{" "}
                    </>
                  )}
                </Text>
                <Spacer />
                {isGroupChat && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<BsThreeDotsVertical />}
                      size="xs"
                      variant="outline"
                      border={3}
                    />
                    <MenuList>
                      <MenuItem icon={<RxExit />} onClick={leaveChat}>
                        Leave chat
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
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
                  // overflow="hidden"
                >
                  {msg.sender._id !== userId && (
                    <Avatar
                      size="sm"
                      name={msg.sender.profile.firstName}
                      src={`http://localhost:4000/${msg.sender.profile.profileImgPath}`}
                      mr={4}
                    />
                  )}
                  <Text
                    fontSize="sm"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {msg.content.startsWith("http:") ? (
                      <Link href={msg.content} isExternal>
                        {msg.content}
                      </Link>
                    ) : (
                      msg.content
                    )}
                  </Text>
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
