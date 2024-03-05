import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Divider,
  Stack,
  Heading,
  ListItem,
  ListIcon,
  List,
  IconButton,
  HStack,
  Avatar,
  useToast,
  useColorModeValue,
  Flex,
  FormLabel,
  FormControl,
  Checkbox,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { IoChatbubbleOutline } from "react-icons/io5";
import { CustomModal } from "../../components/customModel";
import Message, { User, Messages } from "../Message";
import { AuthContext } from "../../context/authContext";
import { io, Socket } from "socket.io-client";
import Select from "react-select";

interface ChatProps {
  messages: Messages[];
  users: User[];
  chatName: string;
  _id: string;
  isGroupChat: boolean;
  chatImgPath: string;
}

interface Connections {
  _id:string;
  username: string;
}

//interface

const Chat = () => {
  const [chat, setChat] = useState<any[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const bg = useColorModeValue("white", "gray.800");
  const [isOpened, setIsOpened] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const { userId } = React.useContext(AuthContext);
  const [connections, setConnections] = useState<Connections[]>([]);
  const [inputChat, setInputChat] = useState({
    users: [],
    chatName: "",
    isGroupChat: false,
    image: "",
  });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.on("newMessage", (message) => {
      console.log("this is the message:: ", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    fetchMessageDetails();
    fetchUserProfileConnection();
  }, []);

  const fetchMessageDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/chat/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("this is the response:: ", response.data);
      setChat(response.data.chat);
    } catch (err) {
      console.log(err);
    }
  };


  //fecth user profile connection
  const fetchUserProfileConnection = async () => {
    try{
      const response = await axios.get(`http://localhost:4000/users/${userId}/connections`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      console.log("this is the response:: ", response.data);
      setConnections(response.data);

    }catch(err){
      console.log(err)
    }
  };


  const option = connections.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const filterChats = chat.filter((chat) =>
    chat.chatName
      ? chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
      : chat.users[0]._id === userId
  );

  const setUpFormData = () => {
    const formData = new FormData();
    formData.append("chatName", inputChat.chatName);
    formData.append(
      "users",
      isEdit
        ? JSON.stringify([...inputChat.users])
        : JSON.stringify([...inputChat.users, userId])
    );

    if (inputChat.image) {
      formData.append("image", inputChat.image);
    }
    if (userId) {
      formData.append("groupAdmin", userId);
    }
    return formData;
  };

  const showToast = (title: string, status: any) => {
    toast({
      title,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCreateChat = async () => {
    try {
      const formData = setUpFormData();
      const response = await axios.post(
        "http://localhost:4000/chat",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("this is the response:: ", response.data);
      showToast("Chat created successfully", "success");
      setIsOpened(false);
      fetchMessageDetails();
    } catch (err) {
      showToast("Error creating chat", "error");
      console.log(err);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("this is the response:: ", response.data);
      showToast("Chat deleted successfully", "success");
      fetchMessageDetails();
    } catch (err) {
      console.log(err);
      showToast("Error deleting chat", "error");
    }
  };

  const handleEditChat = async (chatId: string) => {
    console.log("this is the chatId:: ", chatId);
    if (!chatId) return "No chat id";
    try {
      const formData = setUpFormData();
      const response = await axios.put(
        `http://localhost:4000/chat/${chatId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("this is the response:: ", response.data);
      showToast("Chat edited successfully", "success");
      setIsEdit(false);
      fetchMessageDetails();
    } catch (err) {
      console.log(err);
      showToast("Error editing chat", "error");
    }
  };

  const ChatInputChange = (value: any, { name }: { name: string }) => {
    if (Array.isArray(value)) {
      // This is the Select case. value is an array of selected options.
      setInputChat({
        ...inputChat,
        [name]: value.map((option: any) => option.value),
      });
    } else {
      // This is the Input case. value is an event object.
      setInputChat({ ...inputChat, [value.target.id]: value.target.value });
    }
    console.log("this is the inputChat:: ", inputChat);
  };

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setInputChat((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };


  return (
    <>
      <Box bg={bg} minH="100vh" py="12" px={{ base: "4", lg: "8" }} mt={16}>
        <Box maxW="md" mx="auto">
          <Heading textAlign="center" size="xl" fontWeight="extrabold">
            Chat
          </Heading>
          <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
            Chat with Connections
          </Text>
        </Box>
        <Divider my="8" />
        <Flex
          h="calc(100vh - 200px)"
          direction={{ base: "column-reverse", md: "row" }}
          overflow="hidden"
        >
          {/* Left Column */}
          <VStack
            w={{ base: "full", md: "25%" }}
            h="full"
            bg={bg}
            boxShadow="base"
            rounded="md"
            p={5}
            overflowY="auto"
            overflowX="hidden"
          >
            <Flex align="center" justify="space-between" w="full">
              <Text fontWeight="bold" fontSize="lg">
                Chat
              </Text>
              <IconButton
                aria-label="Add chat"
                icon={<IoChatbubbleOutline />}
                colorScheme="green"
                variant="ghost"
                size="xl" // Change this line
                onClick={() => setIsOpened(true)}
              />
            </Flex>
            <Input
              placeholder="Search chats..."
              mb={5}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <List
              spacing={3}
              w="full"
              overflowY="auto"
            scrollBehavior={"smooth"}
              overflowX="hidden"
              h={{ base: "calc(100vh - 200px)", md: "full" }}
            >
              {filterChats.map((chat, index) => (
                <ListItem
                  key={index}
                  p={2}
                  _hover={{ cursor: "pointer", bg: "gray.100" }}
                  borderRadius="md"
                  bg={bg}
                  boxShadow="base"
                  rounded="md"
                  onClick={() => {
                    setSelectedChat(chat);
                    setMessages(chat.messages);
                    fetchMessageDetails();
                  }}
                >
                  <HStack>
                    {chat.isGroupChat ? (
                      <Avatar
                        size="sm"
                        name={chat.chatName}
                        src={
                          chat.chatImgPath &&
                          `http://localhost:4000/${chat.chatImgPath}`
                        }
                      />
                    ) : (
                      <Avatar
                        size="sm"
                        src={
                          userId === chat.users[0]?._id
                            ? chat.users[1]?.profile?.profileImgPath &&
                              `http://localhost:4000/${chat.users[1].profile.profileImgPath}`
                            : chat.users[0]?.profile?.profileImgPath &&
                              `http://localhost:4000/${chat.users[0].profile.profileImgPath}`
                        }
                        name={
                          userId === chat.users[0]?._id
                            ? `${chat.users[1]?.profile?.firstName} ${chat.users[1]?.profile?.lastName}`
                            : `${chat.users[0]?.profile?.firstName} ${chat.users[0]?.profile?.lastName}`
                        }
                      />
                    )}
                    <VStack align="start" spacing={1}>
                      {chat.chatName ? (
                        <Text fontWeight="bold">{chat.chatName}</Text>
                      ) : (
                        <Text fontWeight="bold">
                          {chat.users[0]?._id === userId
                            ? `${chat.users[1]?.profile?.firstName} ${chat.users[1]?.profile?.lastName}`
                            : `${chat.users[0]?.profile?.firstName} ${chat.users[0]?.profile?.lastName}`}
                        </Text>
                      )}
                      {/* <Text fontWeight="bold">{chat.chatName }</Text> */}
                      <Tooltip
                        label={
                          chat.messages[chat.messages.length - 1]?.content ||
                          "No messages yet"
                        }
                        placement="top-start"
                      >
                        <Text fontSize="sm" isTruncated>
                          {chat.messages[chat.messages.length - 1]?.content ||
                            "No messages yet"}
                        </Text>
                      </Tooltip>
                    </VStack>
                    <Spacer />

                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<BsThreeDotsVertical />}
                        size="xs"
                        variant="outline"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<AiFillEdit />}
                          isDisabled={
                            chat?.groupAdmin !== userId && chat?.isGroupChat
                          }
                          onClick={() => {
                            setIsOpened(true);
                            setIsEdit(true);
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<AiFillDelete />}
                          isDisabled={
                            chat?.isGroupChat && chat?.groupAdmin !== userId
                          }
                          onClick={() => {
                            !chat?.isGroupChat ||
                            (chat?.isGroupChat && chat?.groupAdmin === userId)
                              ? handleDeleteChat(chat._id)
                              : toast({
                                  title: "You are not the admin",
                                  status: "error",
                                  duration: 3000,
                                  isClosable: true,
                                });
                          }}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </VStack>
          <Divider orientation="vertical" />
          {/* Right Column */}
          <VStack
            w={{ base: "full", md: "75%" }}
            h="full"
            bg={bg}
            boxShadow="base"
            rounded="md"
            p={5}
            overflowY="auto"
            overflowX="hidden"
          >
            <Message
              users={selectedChat?.users || []}
              message={messages || []} //this cause the error when the user click on the chat
              _id={selectedChat?._id || ""}
              socket={socket}
              chatImgPath={selectedChat?.chatImgPath || ""}
            />
          </VStack>
        </Flex>
      </Box>
      {isOpened && (
        <CustomModal
          isOpen={isOpened}
          onClose={() => setIsOpened(false)}
          title={isEdit ? "Edit Chat" : "Create Chat"}
          body={
            <>
              <FormControl mt={4} id="chatName">
                <FormLabel>Chat Name</FormLabel>
                <Input
                  placeholder="Enter chat name"
                  onChange={(e) => ChatInputChange(e, { name: "chatName" })}
                />
              </FormControl>
              <FormControl mt={4} id="users">
                {isEdit ? (
                  <FormLabel>Add Users</FormLabel>
                ) : (
                  <FormLabel>Users</FormLabel>
                )}
                <Select
                  options={option}
                  isMulti
                  onChange={(selectedOptions) =>
                    ChatInputChange(selectedOptions, { name: "users" })
                  }
                  classNamePrefix={"select"}
                />
              </FormControl>
              <FormControl mt={4} id="image">
                <FormLabel>Chat Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  border="none"
                  onChange={handleImageChange}
                />
              </FormControl>
            </>
          }
          footer={
            <>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => setIsOpened(false)}
              >
                Close
              </Button>
              <Button
                colorScheme={isEdit ? "blue" : "green"}
                onClick={
                  isEdit
                    ? () => {
                        handleEditChat(selectedChat?._id || "");
                        setIsOpened(false);
                      }
                    : handleCreateChat
                }
              >
                {isEdit ? "Edit" : "Create"}
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

export default Chat;
