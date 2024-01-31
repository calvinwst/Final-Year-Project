import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import axios from "axios";
import CustomFeedCard from "../../components/customFeedCard";
// improt axios from "axios";

const UserFeedDetails = () => {
  //   const { userFeedid } = useParams<{ userFeedid: string }>();
  const { userFeedID } = useParams<{ userFeedID: string }>();
  const [userFeed, setUserFeed] = useState<any[]>([]);

  const toast = useToast();

  useEffect(() => {
    fetchUserFeedDetails();
  }, []);

  console.log("this is userFeed >>>>>> ", userFeed);
  console.log("this is userFeedid >>>>>> ", userFeedID);

  const fetchUserFeedDetails = async () => {
    try {
      const response = axios
        .get(`http://localhost:4000/userfeed/${userFeedID}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          //   console.log("this is the response:: ", response);
          console.log("this si the data:: ", response.data);
          setUserFeed([response.data]);
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
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

  return (
    <>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} mt={16}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>User Feed Details</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            {userFeed.map((userFeed: any) => (
              <CustomFeedCard
                _id={userFeed._id}
                title={userFeed.title}
                like={userFeed.like}
                content={userFeed.content}
                createdAt={userFeed.createdAt}
                name={userFeed.user ? userFeed.user.username : ""}
                comments={userFeed.comment}
                fileImgPath={userFeed.multimediaContent}
                profileImgPath={
                  userFeed.user ? userFeed.user.profilePicture : ""
                }
                updateComments={updateComments}
                deleteComment={deletedComment}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default UserFeedDetails;
