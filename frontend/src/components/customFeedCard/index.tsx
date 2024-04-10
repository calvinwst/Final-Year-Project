import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Flex,
  Heading,
  Text,
  IconButton,
  Image,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  MenuList,
  Menu,
  MenuItem,
  MenuButton,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Toast,
  useToast,
  Textarea,
  FormControl,
  FormLabel,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiChat, BiShare, BiSolidLike } from "react-icons/bi";
import { AuthContext } from "../../context/authContext";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import axios from "axios";
import CustomModal from "../../components/customModel";
import { Link } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import Select from "react-select";
import { io, Socket } from "socket.io-client";

import jwt_decode from "jwt-decode";

interface UserProfile {
  profileImgPath: string;
}

interface User {
  _id: string;
  username: string;
  profile: UserProfile;
}

interface Comment {
  content: string;
  _id: string;
  user: User;
}

interface CustomFeedCardProps {
  _id?: string;
  title?: string;
  name: string;
  content: string;
  fileImgPath?: string;
  profileImgPath?: string;
  createdAt: Date;
  onDelete?: () => void;
  onEdit?: () => void;
  like?: [] | null;
  comments: [];
  updateComments?: (postId: string, comment: Comment) => void;
  deleteComment?: (postId: string, commentId: string) => void;
  editPost?: boolean;
  moderator?: string;
  type: "user" | "community";
}

const CustomFeedCard: React.FC<CustomFeedCardProps> = ({
  name,
  content,
  fileImgPath,
  profileImgPath,
  title,
  _id,
  createdAt,
  onDelete,
  onEdit,
  like,
  comments,
  updateComments,
  deleteComment,
  editPost,
  moderator,
  type,
}) => {
  console.log("the comment in userFeed >>", comments);
  console.log("the like in userFeed >>", editPost);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comment, setComment] = useState("");
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [isLike, setIsLike] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [connections, setConnections] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const toast = useToast();
  const calTimeDiff = (createdAt: Date) => {
    const date1 = new Date(createdAt);
    const date2 = new Date();
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  useEffect(() => {
    if (userId !== undefined) {
      if (userIncludeInLike()) {
        setIsLike(true);
      }
    }
    fetchUserProfileConnection();
  }, [userId]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const LikePost = async () => {
    console.log("this is _id >>>", _id);
    try {
      const response = await axios.post(
        `http://localhost:4000/userfeed/${_id}/like`,
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("this is the response :: ", response);
      setIsLike(true);
      toast({
        title: "Post liked",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const unLike = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/userfeed/${_id}/unlike/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("this is the response :: ", response);
      setIsLike(false);
    } catch (err) {
      console.log(err);
    }
  };

  const userIncludeInLike = () => {
    return like?.some((item) => item === userId);
  };

  const addComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/userfeed/${_id}/comment`,
        {
          user: userId,
          content: (document.getElementById("comment") as HTMLTextAreaElement)
            ?.value,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      // console.log("this is the response :: ", response.data);
      console.log("this is the response :: ", response.data.comment.content);
      setComment("");
      if (_id && userId) {
        updateComments?.(_id, {
          content: response.data.comment.content,
          _id: response.data.comment._id,
          user: {
            _id: userId,
            username: response.data.comment.user.username,
            profile: {
              profileImgPath: response.data.comment.user.profile.profileImgPath,
            },
          },
        });
      }

      toast({
        title: "Comment added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error adding comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onDeleteComment = async (commentId: string, userId: string) => {
    console.log("this is userId >>>>", userId);

    try {
      if (userId === auth.userId) {
        const response = await axios.delete(
          `http://localhost:4000/userfeed/${_id}/comment/${commentId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log("this is the _id :: ", _id);
        console.log("this is the commentId :: ", commentId);
        if (response.status === 200 && _id && commentId) {
          // deleteComment(_id!, commentId)
          deleteComment?.(_id, commentId);

          toast({
            title: "Comment deleted",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "You can't delete other user comment",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error deleting comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchUserProfileConnection = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/${userId}/connections`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("this is the response :: ", response.data);
      setConnections(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const option = connections.map((connection: any) => {
    return { value: connection._id, label: connection.username };
  });

  const handleShareChange = (selectOptions: any) => {
    setSelectedConnections(selectOptions);
    console.log("this is the selected connections >>>", selectOptions);
  };

  const sharePost = () => {
    if (socket && userId) {
      socket.emit("sharePost", {
        postId: `http://localhost:3000/userfeed/${_id}`,
        senderId: userId,
        receiverId: selectedConnections.map(
          (connection: any) => connection.value
        ),
      });
      toast({
        title: "Post shared successfully to connections chatbox",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // console.log("this is the like >>>", like);
  console.log("This is the isLike >>>", isLike);

  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" bg="white" shadow="sm" p={3}>
        <Flex p={5} alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Avatar
              name={name}
              src={`http://localhost:4000/${profileImgPath}`}
              size="md"
            />

            <Box ml="3">
              <Flex alignItems="center">
                <Heading as="h3" size="md">
                  {name}
                </Heading>
                {editPost && (
                  <Tooltip label="This post has been edited" fontSize="md">
                    <Box ml="2" display="flex" alignItems="center">
                      <Icon as={RiEdit2Fill} color="gray.500" />
                      <Text ml="1" fontSize="sm" color="gray.600">
                        Edited
                      </Text>
                    </Box>
                  </Tooltip>
                )}
              </Flex>
              <Text fontSize="sm" color="gray.600">
                {calTimeDiff(createdAt)}
              </Text>{" "}
            </Box>
          </Flex>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<BsThreeDotsVertical />}
              variant="outline"
            />
            <MenuList>
              {moderator === auth.userId && (
                <MenuItem icon={<AiFillDelete />} onClick={onDelete}>
                  Delete
                </MenuItem>
              )}
              {type === "user" && (
                <MenuItem icon={<AiFillEdit />} onClick={onEdit}>
                  Edit
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>
        <Box p={5}>
          {title && (
            <Heading as="h3" size="md">
              {title}
            </Heading>
          )}
          <Text mb={4}>{content}</Text>
          {fileImgPath ? (
            <Box _hover={{ cursor: "pointer", opacity: 1.8 }}>
              <Image
                src={`http://localhost:4000/${fileImgPath}`}
                alt={name}
                boxSize="350px"
                objectFit="cover"
                onClick={onOpen}
              />
            </Box>
          ) : null}
        </Box>
        <Flex p={5} borderTopWidth="1px" justifyContent="space-between">
          <Button
            leftIcon={isLike ? <BiSolidLike /> : <BiLike />}
            variant="ghost"
            onClick={isLike ? unLike : LikePost}
          >
            Like
          </Button>
          <Button
            leftIcon={<BiChat />}
            variant="ghost"
            onClick={() => {
              setShowComments(!showComments);
            }}
          >
            Comment
          </Button>
          <Button
            leftIcon={<BiShare />}
            variant="ghost"
            onClick={() => {
              setIsShare(true);
            }}
          >
            Share
          </Button>
        </Flex>
        {showComments && (
          <>
            <Box p={6} borderTopWidth="1px">
              {comments.map((comment: any) => (
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  key={comment._id}
                  mb={4}
                >
                  <Flex alignItems="center">
                    <Avatar
                      src={`http://localhost:4000/${comment.user.profile.profileImgPath}`}
                      size="sm"
                    />
                    <Box ml="3" mt={2}>
                      <Link to={`/network/${comment.user._id}`}>
                        <Heading as="h3" size="sm">
                          {comment.user.username}
                        </Heading>
                      </Link>
                      <Text fontSize="sm" color="gray.600">
                        {comment.content}
                      </Text>
                    </Box>
                  </Flex>
                  {comment.user._id === auth.userId && (
                    <Button
                      ml="3"
                      size="xs"
                      variant="ghost"
                      rightIcon={<AiFillDelete />}
                      onClick={() =>
                        onDeleteComment(comment._id, comment.user._id)
                      }
                    />
                  )}
                </Flex>
              ))}
              <FormControl id="comment">
                <FormLabel mt={5}>Comment</FormLabel>
                <Textarea
                  id="comment"
                  placeholder="Write a detailed comment..."
                  size="lg"
                  p={2}
                  borderColor="gray.300"
                  _placeholder={{ color: "gray.500" }}
                  value={comment} // Bind the value to the state
                  onChange={(e) => setComment(e.target.value)} // Update the state when the value changes
                />
                <Button mt={2} colorScheme="blue" onClick={addComment}>
                  Submit
                </Button>
              </FormControl>
            </Box>
          </>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="90vw" maxHeight="90vh">
          <ModalBody display="flex" alignItems="center" justifyContent="center">
            <Image
              src={`http://localhost:4000/${fileImgPath}`}
              alt={name}
              objectFit="contain"
              maxW="100%"
              maxH="100%"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      {
        //Modal to share the link of the post to selected connections
        isShare ? (
          <CustomModal
            isOpen={isShare}
            onClose={() => setIsShare(false)}
            title="Share Post"
            body={
              <>
                <FormControl id="share">
                  <FormLabel>Share with</FormLabel>
                  <Select
                    isMulti
                    options={option}
                    onChange={handleShareChange}
                  />
                </FormControl>
              </>
            }
            footer={
              <>
                <Button
                  colorScheme="red"
                  onClick={() => setIsShare(false)}
                  mr={2}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    // console.log("this is the selected connections >>>", selectedConnections);
                    sharePost();
                    setIsShare(false);
                  }}
                >
                  Share
                </Button>
              </>
            }
          />
        ) : null
      }
    </>
  );
};

export default CustomFeedCard;
