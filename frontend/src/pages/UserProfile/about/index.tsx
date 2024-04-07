import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  Textarea,
  useDisclosure,
  Button,
  FormControl,
  Tooltip,
  VStack,
  Icon,
  HStack,
  Grid,
  GridItem,
  Input,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaStethoscope,
  FaRegAddressCard,
} from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import CustomModal from "../../../components/customModel";
import CustomButton from "../../../components/customButton";
import { Form } from "react-router-dom";

interface AboutSectionProps {
  aboutText: string;
  profileData: any;
  userId: any;
  token: any;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  aboutText,
  profileData,
  userId,
  token,
}) => {
  useEffect(() => {
    setEditedAbout(profileData.about);
  }, [profileData.about]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editedAbout, setEditedAbout] = useState(profileData.about);
  const [expanded, setExpanded] = useState(false);
  const toast = useToast();

  console.log("this is the profileData: ", profileData);
  const handleAboutChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedAbout(event.target.value);
  };

  const handleSave = () => {
    //call api to save
    console.log("this is the editedAbout in handlesave: ", editedAbout);
    fetch(`http://localhost:4000/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        about: editedAbout,
        location: profileData.location,
        specialty: profileData.specialty,
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Profile updated.",
            description: "Your profile has been updated successfully.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          return response.json(); // This returns a Promise
        } else {
          throw new Error("Request failed!");
        }
      })
      .then((data) => {
        console.log("this is the data  >>>", data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("click save button");

    onClose();
  };

  return (
    <Box mb={3}>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="md" mb={2}>
          About
        </Heading>
        <Tooltip label="Edit your profile information">
          <IconButton
            aria-label="Edit About"
            icon={<EditIcon />}
            onClick={onOpen}
          />
        </Tooltip>
      </Flex>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <>
          {profileData.firstName ||
          profileData.lastName ||
          profileData.location ||
          profileData.specialty ||
          editedAbout ? (
            <>
              <GridItem display="flex" alignItems="center">
                <Icon as={FaUser} mr={2} />
                <Text fontWeight="semibold">{`First Name: ${profileData.firstName}`}</Text>
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <Icon as={FaUser} mr={2} />
                <Text fontWeight="semibold">{`Last Name: ${profileData.lastName}`}</Text>
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <Icon as={FaMapMarkerAlt} mr={2} />
                {profileData.location ? (
                  <Text fontWeight="semibold">{`Location: ${profileData.location}`}</Text>
                ) : (
                  <Text fontWeight="semibold">Location: Not specified</Text>
                )}
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <Icon as={FaStethoscope} mr={2} />
                {profileData.specialty ? (
                  <Text fontWeight="semibold">{`Specialty: ${profileData.specialty}`}</Text>
                ) : (
                  <Text fontWeight="semibold">Specialty: Not specified</Text>
                )}
              </GridItem>
              <GridItem
                colSpan={2}
                display="flex"
                alignItems="center"
                borderBottom="1px"
                borderColor="gray.200"
                pb={2}
              >
                <Box flex="1" overflow="hidden">
                  <VStack align="start">
                    <Text
                      fontWeight="semibold"
                      textAlign="justify"
                      isTruncated={!expanded}
                    >
                      <Icon as={MdInfo} mr={2} />
                      {`About: ${editedAbout}`}
                    </Text>
                  </VStack>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? "Show less" : "Show more"}
                  </Button>
                </Box>
              </GridItem>
            </>
          ) : (
            <Text>No information available</Text>
          )}
        </>
      </Grid>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit About"
        body={
          <Box>
            <FormControl id="location" mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="New York, NY"
                value={profileData.location}
                onChange={(e) => {
                  profileData.location = e.target.value;
                }}
              />
            </FormControl>
            <FormControl id="specialty" mb={4}>
              <FormLabel>Specialty</FormLabel>
              <Input
                placeholder="Cardiology"
                value={profileData.specialty}
                onChange={(e) => {
                  profileData.specialty = e.target.value;
                }}
              />
            </FormControl>
            <FormControl id="about">
              <FormLabel>About</FormLabel>
              <Textarea
                placeholder="Tell us more about yourself"
                value={editedAbout}
                onChange={handleAboutChange}
                resize="vertical"
              />
              {editedAbout && (
                <IconButton
                  aria-label="Clear about"
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={() => setEditedAbout("")}
                  variant="ghost"
                  position="absolute"
                  right={3.5}
                />
              )}
            </FormControl>
          </Box>
        }
        footer={
          <Flex justifyContent="flex-end">
            <CustomButton
              text="Cancel"
              type="submit"
              onClick={onClose}
              color="red"
              mr={4}
            />

            <CustomButton
              text="Save"
              type="submit"
              onClick={handleSave}
              color="blue"
            />
          </Flex>
        }
      />
    </Box>
  );
};

export default AboutSection;
