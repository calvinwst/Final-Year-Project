import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Image,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  useToast,
  Divider,
  Avatar,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import CustomButton from "../../components/customButton";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../components/customModel";
import CustomFeedCard from "../../components/customFeedCard";
import { set } from "date-fns";

const CommunityDetails = () => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [community, setCommunity] = useState<any | null>({
    name: "",
    description: "",
    members: [],
    communityFeed: [],
    moderator: "",
    image: "",
  });
  const [posts, setPosts] = useState<any | null>({
    title: "",
    content: "",
    image: "",
  });
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  console.log("this is user id in community details", userId);
  const toast = useToast();
  const numberOfMembers = community.member?.length;
  const bgColors = useColorModeValue("white", "gray.700");

  const moderator = community.moderator;

  useEffect(() => {
    fetchCommunityDetails();
  }, []);

  //call details api
  const fetchCommunityDetails = () => {
    axios
      .get(`http://localhost:4000/community/${communityId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("this is the response afing>>>>", response);
        console.log("this is the response >>>>", response.data);
        setCommunity(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //calling delete api
  const handleDelete = () => {
    console.log("this is the communityId >> ", communityId);
    axios
      .delete(`http://localhost:4000/community/${communityId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("this is the response", res);
        navigate("/communityProfile");
        // setCommunity(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //calling join api
  const handleJoin = () => {
    axios
      .post(
        `http://localhost:4000/community/${communityId}/join`,
        {
          member: userId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        fetchCommunityDetails();
        toast({
          title: "Joined Community",
          description: "You have successfully joined the community",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "You have already joined the community",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  //calling leave api
  const handleLeave = () => {
    axios
      .delete(
        `http://localhost:4000/community/${communityId}/member/${userId}/leave`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        toast({
          title: "Left Community",
          description: "You have successfully left the community",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchCommunityDetails();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "You have already left the community",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  //calling edit api
  const handleEdit = () => {
    axios
      .put(
        `http://localhost:4000/community/${communityId}`,
        {
          name: community.name,
          description: community.description,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log("this is the response", response.data);
        fetchCommunityDetails();
        toast({
          title: "Edited",
          description: "You have successfully edited",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
        setIsEdit(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //calling post api
  const handlePost = () => {
    const formData = new FormData();
    formData.append("title", posts.title);
    formData.append("content", posts.content);
    formData.append("image", posts.image);
    if (
      userId &&
      community?.member?.some((member: any) => member._id === userId)
    ) {
      formData.append("user", userId);
      axios
        .post(`http://localhost:4000/community/${communityId}/post`, formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log("this is the response", response.data);
          fetchCommunityDetails();
          toast({
            title: "Posted",
            description: "You have successfully posted",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setIsLoading(false);
          setPosts({
            title: "",
            content: "",
            image: "",
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      toast({
        title: "Error",
        description: "You have to be logged or join the community to post ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    console.log("this is the post >>> ", posts);
  };

  //calling delete post api for moderator
  const handleDeletePost = (postId: string) => {
    const moderator = community.moderator;
    console.log("this is the moderator >> ", moderator);
    if (userId === moderator && moderator !== "") {
      axios
        .delete(
          `http://localhost:4000/community/${communityId}/post/${postId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          console.log("this is the response", res);
          

          toast({
            title: "Deleted",
            description: "You have successfully deleted",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          fetchCommunityDetails();
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Error",
            description: "You have already deleted the post",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "Error",
        description: "You are not the moderator of this community",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e: any) => {
    setPosts({
      ...posts,
      image: e.target.files[0],
    });
    console.log("this is the post >>> ", posts);
  };

  const handleInputChange = (e: any) => {
    setPosts({
      ...posts,
      [e.target.id]: e.target.value,
    });
    console.log("this is the post >>> ", posts);
  };

  const handleEditChange = (e: any) => {
    setCommunity({
      ...community,
      [e.target.id]: e.target.value,
    });
    console.log("this is the community in editchanges >>> ", community);
  };

  const updateComments = (postId: string, comment: any) => {
    setCommunity({
      ...community,
      communityFeed: community.communityFeed.map((post: any) => {
        if (post._id === postId) {
          return {
            ...post,
            comment: [...post.comment, comment],
          };
        } else {
          return post;
        }
      }),
    });
  };

  const deleteComment = (postId: string, commentId: string) => {
    setCommunity({
      ...community,
      communityFeed: community.communityFeed.map((post: any) => {
        if (post._id === postId) {
          return {
            ...post,
            comment: post.comment.filter(
              (comment: any) => comment._id !== commentId
            ),
          };
        } else {
          return post;
        }
      }),
    });
  };

  return (
    <>
      <Box boxShadow="xl" p={6} bg={bgColors} mt={16} rounded="md">
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Heading size="xl" fontWeight="extrabold">
            {community?.name}
          </Heading>
          <Badge colorScheme="teal" mt={3} mb={4}>
            {community?.status}
          </Badge>{" "}
          {/* Community status */}
          <Text mt={2} color="gray.600" textAlign="center">
            {community?.description}
          </Text>
          {community.moderator === userId ? (
            <>
              <Flex direction="row" alignItems="center" justifyContent="center">
                <Button
                  onClick={() => setIsEdit(true)}
                  colorScheme="blue"
                  mt={6}
                  size="lg"
                  mr={4}
                >
                  Edit Community
                </Button>
                <Button
                  onClick={() => setIsDelete(true)}
                  colorScheme="red"
                  mt={6}
                  size="lg"
                >
                  Delete Community
                </Button>
              </Flex>
            </>
          ) : (
            <>
              {community.member?.some(
                (member: any) => member._id === userId
              ) ? (
                <Button
                  onClick={handleLeave}
                  colorScheme="red"
                  mt={6}
                  size="lg"
                >
                  Leave Community
                </Button>
              ) : (
                <Button
                  onClick={handleJoin}
                  colorScheme="teal"
                  mt={6}
                  size="lg"
                  disabled={community?.member?.some(
                    (member: any) => member._id === userId
                  )}
                >
                  Join Community
                </Button>
              )}
            </>
          )}
        </Flex>

        <Divider my={6} />

        <Heading size="md" mb={4} textAlign="center">
          Community Members: {numberOfMembers}
        </Heading>

        <Divider my={6} />

        <Heading size="md" mb={4} textAlign="center">
          Community Posts
        </Heading>
        <Flex padding={4} justifyContent="center" direction="column">
          <Box p={4} bg={bgColors} rounded="lg" shadow="xl" mb={4}>
            <FormControl id="title" mb={2}>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Title"
                onChange={handleInputChange}
                value={posts.title}
              />
            </FormControl>
            <Flex alignItems="start">
              <FormControl id="content" mr={2}>
                <FormLabel>Post Content</FormLabel>
                <Textarea
                  placeholder="WHAT ON YOUR MIND ....."
                  onChange={handleInputChange}
                  value={posts.content}
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
              <Spacer />
            </Flex>
            <Button colorScheme="teal" size="lg" mt={2} onClick={handlePost}>
              Post
            </Button>
          </Box>
        </Flex>
        <Divider my={6} color={"blackAlpha.900"} />
        <Stack spacing={4}>
          {community?.communityFeed?.map((post: any) => (
            <CustomFeedCard
              key={post._id}
              _id={post._id}
              name={post.user ? post.user.username : ""}
              title={post.title}
              comments={post.comment}
              content={post.content}
              createdAt={post.createdAt}
              profileImgPath={post.user ? post.user.profile.profileImgPath : ""}
              fileImgPath={post.multimediaContent}
              onDelete={() => handleDeletePost(post._id)}
              onEdit={() => console.log("edit")}
              updateComments={updateComments}
              deleteComment={deleteComment}
              moderator={moderator}
              verified={post.user ? post.user.emailVerification.verified : false}
              type="community"
            />
          ))}
        </Stack>
      </Box>
      {isDelete && (
        <CustomModal
          isOpen={isDelete}
          onClose={() => setIsDelete(false)}
          title="Are you sure you want to delete this community?"
          body="This action cannot be undone."
          footer={
            <>
              <Button
                colorScheme="teal"
                mr={3}
                onClick={() => setIsDelete(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} colorScheme="red">
                Delete
              </Button>
            </>
          }
        />
      )}
      {isEdit && (
        <CustomModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
          title="Edit Community"
          body={
            <>
              <FormControl id="name" mb={3}>
                <FormLabel>Community Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Community Name"
                  value={community.name}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl id="description">
                <FormLabel>Community Description</FormLabel>
                <Textarea
                  placeholder="Community Description"
                  onChange={handleEditChange}
                  value={community.description}
                />
              </FormControl>
            </>
          }
          footer={
            <>
              <Button
                colorScheme="teal"
                mr={3}
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit} colorScheme="blue">
                Edit
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

export default CommunityDetails;
