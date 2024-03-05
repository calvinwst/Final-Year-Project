import React, { useState, useEffect, useContext } from "react";
import CustomCard from "../../components/customCard";
import CustomGridLayout from "../../components/CustomGridLayout";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  useToast,
  Flex,
  Stack,
  Heading,
  IconButton,
  useColorModeValue,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  AddIcon,
  ChevronDownIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import CustomModal from "../../components/customModel";
import CustomButton from "../../components/customButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/authContext";
import CustomListing from "../../components/customListing";
import { ca } from "date-fns/locale";
import { set } from "date-fns";

interface CommunityProfileProps {
  setShowNav(showNav: boolean): void;
}
type Community = {
  _id: string;
  name: string;
  description: string;
  image: string;
  moderator?: string;
};

const CommunityProfile: React.FC<CommunityProfileProps> = ({ setShowNav }) => {
  const [community, setCommunity] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editCommunityId, setEditCommunityId] = useState<string | null>(null);

  // const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const bgColors = useColorModeValue("white", "gray.700");
  const [addCommunityData, setAddCommunityData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const auth = useContext(AuthContext);
  const token = auth.token;
  const userId = auth.userId;

  const toast = useToast();

  useEffect(() => {
    getCommunity();
  }, [userId]);

  const handleClickDetail = (communityId: string) => {
    console.log("this is communityId", communityId);
  };

  //CALLING GET API
  const getCommunity = () => {
    axios
      .get("http://localhost:4000/community", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setCommunity(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //calling post api
  const handleAddCommunity = () => {
    const formData = new FormData();
    formData.append("name", addCommunityData.name);
    formData.append("description", addCommunityData.description);
    formData.append("image", addCommunityData.image);
    if (userId) {
      formData.append("moderator", userId);
    }
    console.log("this is formData", formData);
    fetch("http://localhost:4000/community", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        toast({
          title: "Community Added.",
          description: "We've added your community for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        getCommunity();
        setIsAdding(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          title: "Community Not Added.",
          description: "We've not added your community for you.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  //calling delete api
  const handleDelete = (deletedId: string) => {
    console.log("this is the deletedId", deletedId);
    axios
      .delete(`http://localhost:4000/community/${deletedId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("this is res.data", res.data);
        const updateCommunity = community.filter(
          (comm) => comm._id !== deletedId
        );
        console.log("this is updateCommunity", updateCommunity);
        setCommunity(updateCommunity);
        toast({
          title: "Community Deleted.",
          description: "We've deleted your community for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Community Not Deleted.",
          description: "We've not deleted your community for you.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const handleEdit = (editedId: string) => {
    setIsEdit(true);
    setEditCommunityId(editedId);
    console.log("this is editedId in index:   ", editedId);
  };

  //calling put api
  const handleSaveEdit = () => {
    if (editCommunityId) {
      const formData = new FormData();
      formData.append("name", addCommunityData.name);
      formData.append("description", addCommunityData.description);
      formData.append("image", addCommunityData.image);

      // console.log("this is formData", formData);

      axios
        .put(`http://localhost:4000/community/${editCommunityId}`, formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log("this is res.data", res.data);
          // const updateCommunity = community.filter(
          //   (comm) => comm._id !== editCommunityId
          // );
          // console.log("this is updateCommunity", updateCommunity);
          // setCommunity(updateCommunity);
          toast({
            title: "Community Edited.",
            description: "We've edited your community for you.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          getCommunity();
          setIsEdit(false);
        })
        .catch((err) => {
          toast({
            title: "Community Not Edited.",
            description: "We've not edited your community for you.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          console.log(err);
        });
    }
  };

  const handleChangeCommunity = (event: any) => {
    if (event.target.id === "image") {
      setAddCommunityData({
        ...addCommunityData,
        image: event.target.files[0],
      });
    } else {
      setAddCommunityData({
        ...addCommunityData,
        [event.target.id]: event.target.value,
      });
    }
  };

  console.log("this is the addCommunityData", addCommunityData);

  return (
    <>
      <Flex
        w="auto"
        h="auto"
        justify="center"
        bg={useColorModeValue("gray.100", "gray.300")}
        p={15}
        boxShadow="md"
        alignItems="center"
        justifyContent="center"
        mt={16}
        // rounded="lg"
      >
        <Stack
          spacing={8}
          mx={"auto"}
          maxW={"sm"}
          py={12}
          px={12}
          align={"center"}
        >
          <Stack align={"center"}>
            <Text fontSize={"2xl"}>Community Profile</Text>
          </Stack>
          <IconButton
            aria-label="Add Community"
            colorScheme="teal"
            icon={<AddIcon />}
            onClick={() => setIsAdding(true)}
            size="lg"
          />
        </Stack>
      </Flex>
      {!loading ? (
        <Box p={5} bg={bgColors}>
          <CustomGridLayout>
            {community.map((comm) => {
              console.log("this is community >>>", comm);

              let image = null;
              let imageUrl = null;
              if (comm.image) {
                try {
                  image =
                    typeof comm.image === "string"
                      ? JSON.parse(comm.image)
                      : comm.image;
                  imageUrl = `data:${image.contentType};base64,${Buffer.from(
                    image.data,
                    "binary"
                  ).toString("base64")}`;
                  console.log("this is image", image);
                  console.log("this is imageUrl", imageUrl);
                } catch (error) {
                  console.error("Failed to parse image data", error);
                }
              }

              return (
                <CustomListing
                  item={{
                    id: comm._id,
                    title: comm.name,
                    description: comm.description,
                    image: comm.image,
                    moderator: comm.moderator,
                    onDelete(id) {
                      handleDelete(id);
                    },
                    onEdit(id) {
                      handleEdit(id);
                    },
                    onAdd: handleAddCommunity,
                  }}
                  type="community"
                />
              );
            })}
          </CustomGridLayout>
        </Box>
      ) : (
        <Flex justifyContent="center" alignItems="center" height="auto">
          <LoadingSpinner />
        </Flex>
      )}
      {isAdding && (
        <CustomModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          title="Add Community"
          body={
            <>
              <Box mb={4}>
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Name"
                    onChange={handleChangeCommunity}
                    defaultValue={""}
                  />
                </FormControl>
              </Box>
              <Box mb={4}>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Description"
                    onChange={handleChangeCommunity}
                    defaultValue={""}
                  />
                </FormControl>
              </Box>
              <Box mb={4}>
                <FormControl id="image">
                  <FormLabel>Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    border="none"
                    onChange={handleChangeCommunity}
                  />
                </FormControl>
              </Box>
            </>
          }
          footer={
            <Flex>
              <CustomButton
                type="submit"
                text="Add"
                color="teal"
                // onClick={() => console.log("clicked")}
                onClick={handleAddCommunity}
                mr={3}
              />
              <CustomButton
                type="button"
                text="Cancel"
                color="gray"
                onClick={() => setIsAdding(false)}
              />
            </Flex>
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
              <Box mb={4}>
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Name"
                    onChange={handleChangeCommunity}
                  />
                </FormControl>
              </Box>
              <Box mb={4}>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Description"
                    onChange={handleChangeCommunity}
                  />
                </FormControl>
              </Box>
              <Box mb={4}>
                <FormControl id="image">
                  <FormLabel>Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    border="none"
                    onChange={handleChangeCommunity}
                  />
                </FormControl>
              </Box>
            </>
          }
          footer={
            <Flex>
              <CustomButton
                type="submit"
                text="Save"
                color="teal"
                onClick={handleSaveEdit}
                mr={3}
              />
              <CustomButton
                type="button"
                text="Cancel"
                color="gray"
                onClick={() => setIsEdit(false)}
              />
            </Flex>
          }
        />
      )}
    </>
  );
};

export default CommunityProfile;
