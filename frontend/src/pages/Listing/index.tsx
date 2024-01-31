import React, { useContext, useEffect, useState } from "react";
import CustomGridLayout from "../../components/CustomGridLayout";
import {
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Divider,
  Box,
  SimpleGrid,
  Grid,
  Card,
  Badge,
  CardBody,
  CardFooter,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Toast,
  useToast,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import CustomButton from "../../components/customButton";
import { EditIcon, DeleteIcon, AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import CustomModal from "../../components/customModel";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/authContext";
import CustomListing from "../../components/customListing";
import { set } from "date-fns";

interface ListingProfileProps {
  setShowNav?(showNav: boolean): void;
}

const Listing: React.FC<ListingProfileProps> = ({ setShowNav }) => {
  // setShowNav(true);

  const auth = useContext(AuthContext);
  // const token = auth.token;
  const userId = auth.userId;
  const [researchData, setResearchData] = useState([]);
  const [isAdd, setAdd] = useState(false);
  const [tags, setTags] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addResearch, setAddResearch] = useState({
    title: "",
    description: "",
    tags: tags,
    file: "",
    image: "",
  });

  const bgColors = useColorModeValue("white", "gray.700");

  const toast = useToast();

  const handleInputChange = (event: any) => {
    if (input !== "") {
      setTags([...tags, input]);
      setAddResearch((prevState) => ({
        ...prevState,
        tags: [...tags, input],
      }));
      setInput("");
      console.log("this is the input", input);
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleAddResearchChange = (event: any) => {
    const { id, value } = event.target;
    setAddResearch((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setAddResearch((prevState) => ({
        ...prevState,
        file: event.target.files[0],
      }));
    }
  };

  const handleImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setAddResearch((prevState) => ({
        ...prevState,
        image: event.target.files[0],
      }));
    }
  };

  // console.log("this is the addResearch", addResearch);
  // console.log("this is the tabs being stringified", JSON.stringify(addResearch.tags));

  // call POST API to add research
  const handleAddResearch = async () => {
    const formData = new FormData();
    formData.append("title", addResearch.title);
    formData.append("description", addResearch.description);
    formData.append("tags", JSON.stringify(addResearch.tags));
    if (addResearch.file && auth.userId && addResearch.image) {
      formData.append("file", addResearch.file);
      formData.append("researcher", auth.userId);
      formData.append("image", addResearch.image);
    } else {
      toast({
        title: "Research Not Added",
        description: "Please fill in all fields.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "content-type": "multipart/form-data",
      },
    };

    console.log("this is the form data", formData);

    try {
      const response = await axios.post(
        "http://localhost:4000/research",
        formData,
        config
      );
      console.log("this is the response: ", response);
      toast({
        title: "Research Added",
        description: "Your research has been added.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setAdd(false);
      fetchResearchData(); // Refresh data after successful addition
    } catch (error) {
      console.log("this is the error", error);
    }
  };

  //Call GET API to get research data function
  const fetchResearchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/research", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setResearchData(res.data);
      console.log("this is the research data", res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchData();
  }, []);

  console.log("this is the research data in index >>>>>>> ", researchData);

  return (
    <>
      <Flex
        w="auto"
        h="auto"
        bg={useColorModeValue("gray.100", "gray.300")}
        p={15}
        alignItems="center"
        justifyContent="center"
        mt={16}
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
            <Text fontSize={"2xl"}>Research & Case Listing</Text>
          </Stack>
          <IconButton
            aria-label="Add Research"
            colorScheme="teal"
            boxShadow={"lg"}
            icon={<AddIcon />}
            onClick={() => {
              //call the modal here
              setAdd(true);
              console.log("this is the add research");
            }}
          />
        </Stack>
      </Flex>
      <Divider />
      {isLoading ? (
        <LoadingSpinner
          style={{ margin: "auto", display: "block", marginTop: "auto" }}
        />
      ) : (
        <>
          <Box p={5} bg={bgColors}>
            <CustomGridLayout>
              {researchData.map((research: any) => {
                return (
                  <CustomListing
                    // category={research.category}
                    item={{
                      id: research._id,
                      title: research.title,
                      description: research.description,
                      image: research.imagePath,
                      tag: research.tags,
                    }}
                    type="research"
                  />
                );
              })}
            </CustomGridLayout>
          </Box>
        </>
      )}

      {isAdd && (
        <CustomModal
          isOpen={isAdd}
          onClose={() => {
            setAdd(false);
          }}
          title="Add Research"
          body={
            <>
              <Box>
                <FormControl id="title">
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    id="title"
                    aria-describedby="title-helper-text"
                    defaultValue={""}
                    onChange={handleAddResearchChange}
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel mt={4}>Description</FormLabel>
                  <Textarea
                    id="description"
                    aria-describedby="description-helper-text"
                    defaultValue={""}
                    onChange={handleAddResearchChange}
                  />
                </FormControl>
                <FormControl id="tags">
                  <FormLabel mt={4}>Tags</FormLabel>
                  <Flex alignItems="center">
                    <Input
                      type="text"
                      id="tag"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <Button
                      ml={2}
                      colorScheme="teal"
                      onClick={handleInputChange}
                    >
                      Add tag
                    </Button>
                  </Flex>
                  <Stack direction="row" mt={2} spacing={2}>
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        borderRadius="full"
                        px="3"
                        colorScheme="teal"
                      >
                        {tag !== "" ? tag : null}
                        <CloseIcon
                          ml={1}
                          cursor="pointer"
                          onClick={() => handleRemoveTag(index)}
                        />
                      </Badge>
                    ))}
                  </Stack>
                </FormControl>
                <FormControl id="file">
                  <FormLabel mt={5}>Upload PDF</FormLabel>
                  <Input
                    type="file"
                    accept="application/pdf"
                    border="none"
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormControl id="image">
                  <FormLabel mt={5}>Upload Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    border="none"
                    onChange={handleImageChange}
                  />
                </FormControl>
              </Box>
            </>
          }
          footer={
            <>
              <Flex>
                <CustomButton
                  text="Cancel"
                  type="button"
                  onClick={() => {
                    setAdd(false);
                  }}
                  mr={4}
                />
                <CustomButton
                  text="Add"
                  type="button"
                  color="blue"
                  onClick={handleAddResearch}
                />
              </Flex>
            </>
          }
        />
      )}
    </>
  );
};
{
  /* <Card
          maxW="1200px"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          alignContent={"center"}
        >
          <Box p="6">
            <Box alignItems="baseline">
              <Box
                color={useColorModeValue("gray.800", "white")}
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
              >
                2 beds &bull; 2 baths &bull; 1000 sqft
              </Box>
            </Box>

            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              2 Bedroom Apartment
            </Box>

            <Box>
              <Text as="span" color="gray.600" fontSize="sm">
                $500
              </Text>
            </Box>
            <Badge borderRadius="full" px="2" colorScheme="teal">
              New
            </Badge>
          </Box>

          <Flex
            alignItems="center"
            justifyContent="space-between"
            p={4}
            bg={useColorModeValue("gray.50", "gray.800")}
            borderBottomRadius="lg"
          >
            <Button colorScheme="teal">Contact</Button>
            <Text fontSize="sm">Posted 2 days ago</Text>
          </Flex>
        </Card>
        <Card maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Box p="6">
            <Box alignItems="baseline">
              <Badge borderRadius="full" px="2" colorScheme="teal">
                New
              </Badge>
              <Box
                color={useColorModeValue("gray.800", "white")}
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
              >
                2 beds &bull; 2 baths &bull; 1000 sqft
              </Box>
            </Box>

            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              2 Bedroom Apartment
            </Box>

            <Box>
              <Text as="span" color="gray.600" fontSize="sm">
                $500
              </Text>
            </Box>
          </Box>

          <Flex
            alignItems="center"
            justifyContent="space-between"
            p={4}
            bg={useColorModeValue("gray.50", "gray.800")}
            borderBottomRadius="lg"
          >
            <Button colorScheme="teal">Contact</Button>
            <Text fontSize="sm">Posted 2 days ago</Text>
          </Flex>
        </Card> */
}
export default Listing;
