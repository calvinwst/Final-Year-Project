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
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import CustomModal from "../../../components/customModel";
import CustomButton from "../../../components/customButton";

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

  console.log("this is the editedAbout", editedAbout);

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
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // This returns a Promise
        } else {
          throw new Error("Request failed!");
        }
      })
      .then((data) => {
        // console.log("this is the data ",data); // This logs the data from the Promise
        console.log("this is the data ", data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("click save button");

    onClose();
  };

  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="md" mb={2}>
          About
        </Heading>
        <IconButton
          aria-label="Edit About"
          icon={<EditIcon />}
          onClick={onOpen}
        />
      </Flex>
      <Text mt="2">{`First Name: ${profileData.firstName}`}</Text>
      <Text>{`Last Name: ${profileData.lastName}`}</Text>
      <Text>{`Location: ${profileData.location}`}</Text>
      <Text>{`Specialty: ${profileData.specialty}`}</Text>
      <Text>{`About:  ${editedAbout}`}</Text>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit About"
        body={
          <Box>
            <FormControl id="about">
              <Textarea
                placeholder="About"
                value={editedAbout}
                onChange={handleAboutChange}
              />
            </FormControl>
          </Box>
        }
        footer={
          <Flex justifyContent="flex-end">
            {/* <Button onClick={onClose} mr={4}>
              Cancel
            </Button>
            <Button colorScheme="blue" onSubmit={}>
              Save
            </Button> */}
            <CustomButton
              text="Cancel"
              type="submit"
              onClick={onClose}
              color="blue"
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
