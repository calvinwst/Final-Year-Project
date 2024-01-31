import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useEditable,
  Image,
  Flex,
  useColorModeValue,
  useToast,
  Text,
  Select,
  Divider,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import CustomFeedCard from "../../components/customFeedCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import CustomModal from "../../components/customModel";
import { fr, is } from "date-fns/locale";
import { Form } from "react-router-dom";

const UserFeed = () => {
  const { userId } = useContext(AuthContext);
  const [userFeed, setUserFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editPostId, setEditPostId] = useState<string>("");
  //const [editedPosts, setEditedPosts] = useState<Record<string, boolean>>({});
  const [editPostUserId, setEditPostUserId] = useState<string>("");
  const [isAdd, setAdd] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | string>("");
  const [userFeedContent, setUserFeedContent] = useState({
    user: "",
    content: "",
    image: "",
    _id: "",
    like: [],
  });
  const [community, setCommunity] = useState<any[]>([]);
  const toast = useToast();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchUserFeed();
    fetchUserCommunity();
  }, [userId]);

  console.log("this is the community >>> ", community);

  const fetchUserFeed = async () => {
    try {
      axios
        .get("http://localhost:4000/userfeed", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setUserFeed(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserCommunity = async () => {
    try {
      axios
        .get(`http://localhost:4000/user/${userId}/communities`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setCommunity(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setUserFeedContent((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleInputChange = (e: any) => {
    setUserFeedContent({
      ...userFeedContent,
      content: e.target.value,
      user: userId || "",
    });

    console.log("this are the contents userFeedContent >>> ", userFeedContent);
  };

  const handleEditChange = (e: any) => {
    setUserFeedContent({
      ...userFeedContent,
      content: e.target.value,
    });
    console.log(
      "this are the contents userFeedContent after the edit  >>> ",
      userFeedContent
    );
  };

  const handleEditImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setUserFeedContent((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    }
  };

  const handlePostSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("content", userFeedContent.content);
      formData.append("image", userFeedContent.image);

      if (userFeedContent.user !== "" && userFeedContent._id === "") {
        formData.append("user", userFeedContent.user);
        axios
          .post("http://localhost:4000/userfeed", formData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            console.log("this is res >>> ", res);
            setUserFeedContent((prevState) => {
              return {
                ...prevState,
                content: "",
                user: "",
                image: "",
                _id: "",
              };
            });
            setSelectedImage("");
            fetchUserFeed();
            toast({
              title: "Post Created.",
              description: "Your post has been created.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          })
          .catch((err) => {
            console.log("this is err >>> ", err);
            toast({
              title: "Post Creation Failed.",
              description: "Your post could not be created.",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          });
      } else if (userFeedContent._id && userFeedContent.user !== "") {
        formData.append("user", userFeedContent.user);
        axios
          .post(
            `http://localhost:4000/community/${userFeedContent._id}/post`,
            formData,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            console.log("this is res >>> ", res);
            setUserFeedContent((prevState) => {
              return {
                ...prevState,
                content: "",
                user: "",
                image: "",
                _id: "",
              };
            });
            // setUserFeedContent({
            //   content: "",
            //   user: "",
            //   image: "",
            //   _id: "",
            // });
            setSelectedImage("");
            fetchUserFeed();
            toast({
              title: "Post Created.",
              description: "Your post has been created.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          })
          .catch((err) => {
            console.log("this is err >>> ", err);
            toast({
              title: "Post Creation Failed.",
              description: "Your post could not be created.",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          });
      }
    } catch (err) {
      console.log("Error posting user feed", err);
    }
  };

  //delete post call
  const deletePost = async (id: string, userIdPost: string) => {
    console.log("this is the id >>> ", userIdPost);
    console.log("this is the userId >>> ", userId);
    if (userIdPost === userId) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/userfeed/${id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response);
        fetchUserFeed();
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        title: "You can't delete this post.",
        description: "You can only delete your own posts.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  //Edit API call
  const editPost = async (id: string, userIdPost: string) => {
    console.log("this is the id >>> ", userIdPost);
    console.log("this is the userId >>> ", id);
    if (userIdPost === userId) {
      try {
        const formData = new FormData();
        formData.append("content", userFeedContent.content);
        if (userFeedContent.image) {
          formData.append("image", userFeedContent.image);
        }
        const response = await axios.put(
          `http://localhost:4000/userfeed/${id}`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response);
        fetchUserFeed();
        setShowModal(false);
        // setEditedPost(true);
        toast({
          title: "Post Edited.",
          description: "Your post has been edited.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } catch (err) {
        // console.log(err);
        console.log("this is err >>> ", err);
        toast({
          title: "Post Edit Failed.",
          description: "Your post could not be edited.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "You can't edit this post.",
        description: "You can only edit your own posts.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const updateComments = (postId: string, comment: any) => {
    console.log("this is the comment >>> ", comment);
    setUserFeed((prevFeed) => {
      return prevFeed.map((feed) => {
        if (feed._id === postId) {
          return {
            ...feed,
            comment: [...feed.comment, comment],
          };
        } else {
          return feed;
        }
      });
    });
  };

  const deletedComment = (postId: string, commentId: string) => {
    setUserFeed((prevFeed) => {
      return prevFeed.map((feed) => {
        if (feed._id === postId) {
          return {
            ...feed,
            comment: feed.comment.filter((c: any) => c._id !== commentId),
          };
        } else {
          return feed;
        }
      });
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  console.log("this is the userFeed >>> ", userFeed);
  return (
    <>
      <VStack spacing={4} align="stretch" w="100%" mt={9}>
        <Box
          bg={bg}
          boxShadow="md"
          rounded="lg"
          borderWidth="1px"
          borderColor={borderColor}
          w="65%"
          margin="auto"
          mt={16}
        >
          <Flex padding="4" direction="column">
            <FormControl id="post-user" mb={3}>
              <FormLabel>Choose a Communities</FormLabel>
              <Select
                placeholder="Select option"
                onChange={(e) => {
                  setUserFeedContent((prevState) => ({
                    ...prevState,
                    _id: e.target.value,
                  }));
                }}
              >
                {community.map((community) => (
                  <option key={community._id} value={community._id}>
                    {community.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="post-content" mb={3}>
              <FormLabel>What's on your mind?</FormLabel>
              <Textarea
                placeholder="Share your thoughts..."
                resize="none"
                _focus={{ border: "none", boxShadow: "none" }}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="post-image" mb={3}>
              <FormLabel>Upload Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                border="none"
                p={1}
                _focus={{ border: "none", boxShadow: "none" }}
              />
            </FormControl>
            {selectedImage && (
              <Image
                src={
                  typeof selectedImage === "string"
                    ? selectedImage
                    : URL.createObjectURL(selectedImage)
                }
                alt="Preview"
                maxH="auto"
                mb={3}
              />
            )}
            <Button colorScheme="blue" width="full" onClick={handlePostSubmit}>
              Post
            </Button>
          </Flex>
        </Box>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Divider my={4} color={"blackAlpha.900"} />
            <Flex
              padding={10}
              justifyContent="center"
              direction="column"
              alignItems="center"
            >
              <Heading as="h2" size="xl" mb={2}>
                Your Feed
              </Heading>
              <Stack spacing={4}>
                {userFeed.map((userFeed) => (
                  <CustomFeedCard
                    key={userFeed._id}
                    _id={userFeed._id}
                    like={userFeed.like}
                    comments={userFeed.comment}
                    name={userFeed.user ? userFeed.user.username : ""}
                    content={userFeed.content}
                    fileImgPath={userFeed.multimediaContent}
                    profileImgPath={
                      userFeed.user && userFeed.user.profile
                        ? userFeed.user.profile.profileImgPath
                        : ""
                    }
                    createdAt={userFeed.createdAt}
                    onDelete={() => deletePost(userFeed._id, userFeed.user._id)}
                    onEdit={() => {
                      setShowModal(true);
                      setEditPostId(userFeed._id);
                      setEditPostUserId(userFeed.user._id);
                      setUserFeedContent({
                        user: userFeed.user._id,
                        content: userFeed.content,
                        image: userFeed.multimediaContent,
                        _id: "",
                        like: [],
                      });
                    }}
                    editPost={userFeed.isEdited ? userFeed.isEdited : false}
                    updateComments={updateComments}
                    deleteComment={deletedComment}
                  />
                ))}
              </Stack>
            </Flex>
          </>
        )}
      </VStack>
      {showModal && (
        <CustomModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Edit Post"
          body={
            <>
              <FormControl id="post-content" mb={3}>
                <FormLabel>Edit Your Post</FormLabel>
                <Textarea
                  placeholder="Edit your thoughts...."
                  resize="none"
                  _focus={{ border: "none", boxShadow: "none" }}
                  onChange={handleEditChange}
                />
                <FormLabel>Upload Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  border="none"
                  p={1}
                  _focus={{ border: "none", boxShadow: "none" }}
                />
              </FormControl>
            </>
          }
          footer={
            <>
              <Button
                colorScheme="red"
                width="full"
                onClick={() => {
                  setShowModal(false);
                  setUserFeedContent({
                    user: userId || "",
                    content: "",
                    image: "",
                    _id: "",
                    like: [],
                  });
                  setSelectedImage("");
                }}
                mr={4}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                width="full"
                onClick={() => {
                  editPost(editPostId, editPostUserId);
                }}
              >
                Edit
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

export default UserFeed;
