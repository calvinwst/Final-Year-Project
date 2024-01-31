import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Center,
  Text,
  Heading,
  VStack,
  Grid,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Badge,
  Flex,
  Button,
  Stack,
} from "@chakra-ui/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import CustomButton from "../../components/customButton";
import { AuthContext } from "../../context/authContext";
import CustomModal from "../../components/customModel";
import { set } from "date-fns";
import { CloseIcon } from "@chakra-ui/icons";

interface ResearchDetailsProps {
  id?: string;
}

interface ResearchData {
  title: string;
  filePath: string;
  publicationDate: string;
  description: string;
  researcher: {
    _id: string;
    username: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  _id: string;
  tags: string[];
}

const ResearchDetails: React.FC<ResearchDetailsProps> = ({ id }) => {
  const { researchId } = useParams<{ researchId: string }>();
  const [researchData, setResearchData] = useState<ResearchData>({
    title: "",
    filePath: "",
    publicationDate: "",
    description: "",
    researcher: {
      _id: "",
      username: "",
      profile: {
        firstName: "",
        lastName: "",
      },
    },
    _id: "",
    tags: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [editTags, setEditTags] = useState<string[]>(researchData.tags || []);
  const [newTag, setNewTag] = useState("");
  const time = new Date(researchData.publicationDate);
  const formattedDate = `${time.toLocaleString("en-US", {
    month: "short",
  })} ${time.getDate()} ${time.getFullYear()}`;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const location = useLocation();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/research/${researchId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("this is the response", response.data);
        setResearchData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setEditTags(researchData.tags);
  }, [researchData]);

  const handleDelete = () => {
    // console.log("delete button clicked");
    axios
      .delete(`http://localhost:4000/research/${researchId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("Research deleted successfully");
        setIsDeleting(false);
        setIsLoading(false);
        navigate("/research");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEdit = () => {
    console.log("edit button clicked");
    const updateData = {
      ...researchData,
      tags: editTags,
    };
    console.log("this is the edit tags in handleEdit >>>> ", updateData);
    axios
      .put(`http://localhost:4000/research/${researchId}`, updateData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("Research edited successfully");
        setIsEditing(false);
        setIsLoading(false);
        navigate("/research");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleTagChange = (event: any) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    // setEditTags(editTags.filter((t) => t !== tag));
    const updatedTags = editTags.filter((t) => t !== tag);

    // Update the research data within this callback to ensure we're using the updated tags
    setResearchData((currentData) => ({
      ...currentData,
      tags: updatedTags,
    }));

    return updatedTags;
    // Update the research data within this callback to ensure we're using the updated tags
  };

  const handleEditChange = (event: any) => {
    const { id, value } = event.target;
    setResearchData((currentData) => ({
      ...currentData,
      [id]: value,
    }));
  };

  const handleDownload = () => {
    console.log("download button clicked");
    const pdfUrl = `http://localhost:4000/${researchData.filePath}`;
    // Create a temporary anchor tag and open the PDF in a new tab
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank"; // Open in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Center p={5} bg={"gray.100"} height="90vh">
        <LoadingSpinner />
      </Center>
    );
  }

  if (!researchData) {
    return (
      <Center p={5} bg={"gray.100"} height="90vh">
        <Text fontSize="xl" color="red.500">
          Research not found
        </Text>
      </Center>
    );
  }

  const pdfUrl = `http://localhost:4000/${researchData.filePath}`;

  return (
    <>

      <VStack p={5} bg={"gray.100"} spacing={6} align="stretch" mt={16}>
        <Heading as="h2" size="lg" textAlign="center" mb={4}>
          {researchData.title}
        </Heading>

        <Grid
          templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          gap={6}
          textAlign={"left"}
          px={{ base: "4", md: "12" }}
          py={4}
          bg="white"
          boxShadow="base"
          borderRadius="md"
        >
          <Text fontSize="md" fontWeight="semibold">
            Researcher:{" "}
            <span style={{ fontWeight: "normal" }}>
              {/* {researchData.researcher} */}
              {researchData.researcher.profile.firstName}{" "}
              {researchData.researcher.profile.lastName}
            </span>
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            Publication Date:{" "}
            <span style={{ fontWeight: "normal" }}>{formattedDate}</span>
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            Description:{" "}
            <span style={{ fontWeight: "normal" }}>
              {researchData.description}
            </span>
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            Tags:{" "}
            <span style={{ fontWeight: "normal" }}>
              {researchData.tags.map((tag) => (
                <Badge
                  key={tag}
                  borderRadius="full"
                  colorScheme="blue"
                  mr={2}
                  mb={2}
                >
                  {tag}
                </Badge>
              ))}
            </span>
          </Text>
        </Grid>

        <HStack spacing={4} justify="center" alignItems={"center"}>
          {researchData.researcher._id === userId ? (
            <>
              <CustomButton
                text="Edit"
                color="teal"
                type={"button"}
                onClick={() => setIsEditing(true)}
              />
              <CustomButton
                text="Delete"
                color="red"
                type={"button"}
                onClick={() => setIsDeleting(true)}
              />
            </>
          ) : (
            <>
              <CustomButton
                text="Download"
                color="blue"
                type={"button"}
                onClick={handleDownload}
              />
              <CustomButton
                text="Message"
                color="teal"
                type={"button"}
                onClick={() => navigate(`/chat/${researchData.researcher._id}`)}
                // onClick={() =>
                // {
                //   navigate({
                //     pathname: `/chat/${researchData.researcher._id}`,
                //     state: {
                //       from: location.pathname,
                //     },
                //   });
                // }}

              />
            </>
          )}
        </HStack>

        <Box
          width="100%"
          height="80vh"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          mt={6}
        >
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="pdf"
            loading="lazy"
          />
        </Box>
      </VStack>
      <CustomModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Research"
        body={
          <>
            <Text>
              Are you sure you want to edit this research? This will take you to
              the edit page.
            </Text>
            <FormControl id="title" mt={4}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                defaultValue={researchData.title}
                onChange={handleEditChange}
              />
            </FormControl>
            <FormControl id="description" mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                defaultValue={researchData.description}
                onChange={handleEditChange}
              />
            </FormControl>
            <FormControl id="tags" mt={4}>
              <FormLabel>Tags</FormLabel>
              <Flex alignItems="center">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <Button ml={2} colorScheme="blue" onClick={handleAddTag}>
                  Add
                </Button>
              </Flex>
              <Stack direction="row" flexWrap="wrap" mt={2}>
                {editTags.map((tag) => (
                  <Badge
                    key={tag}
                    borderRadius="full"
                    colorScheme="blue"
                    mr={2}
                    mb={2}
                    cursor="pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <CloseIcon ml={2} />
                  </Badge>
                ))}
              </Stack>
            </FormControl>
          </>
        }
        footer={
          <>
            <CustomButton
              text="Cancel"
              color="teal"
              type={"button"}
              onClick={() => setIsEditing(false)}
              mr={4}
            />
            <CustomButton
              text="Edit"
              color="blue"
              type={"button"}
              // onClick={() => setIsEditing(false)}
              onClick={handleEdit}
            />
          </>
        }
      />
      <CustomModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Research"
        body="Are you sure you want to delete this research?"
        footer={
          <>
            <CustomButton
              text="Cancel"
              color="teal"
              type={"button"}
              onClick={() => setIsDeleting(false)}
              mr={4}
            />
            <CustomButton
              text="Delete"
              color="red"
              type={"button"}
              onClick={handleDelete}
            />
            {/* <Button
              colorScheme="red"
              size="sm"
              onClick={() => {
                // handleDelete();
                console.log("delete button clicked");
              }}
            >
              Delete
            </Button> */}
          </>
        }
      />
    </>
  );
};

export default ResearchDetails;
