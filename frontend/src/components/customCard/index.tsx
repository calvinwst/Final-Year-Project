import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Badge,
  Text,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  Divider,
} from "@chakra-ui/react";
import CustomCardButton from "../customButton/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";

interface CustomCardProps {
  title: string;
  subtitle: string;
  image: any;
  onClick?: () => void;
  id?: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAdd?: (id: string) => void;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  subtitle,
  image,
  onClick,
  onDelete,
  onEdit,
  onAdd,
  id,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log("this is id", id);

  const handleClickDetail = (communityId: string) => {
    navigate(`/community/${communityId}`);
  };

  const handleClickEdit = (communityId: string) => {
    console.log("this is communityId in edit", communityId);
    onEdit!(communityId);
  };

  const handleClickDelete = (communityId: string) => {
    console.log("this is communityId in delete handle", communityId);
    axios
      .delete(`http://localhost:4000/community/${communityId}` 
      , {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        onDelete!(communityId);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Card
        maxW={["90vw", "80vw", "60vw", "40vw", "25vw"]} // Set different maximum widths based on the screen size
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        onClick={onClick}
        cursor="pointer"
      >
        <Image src={image} alt={title} />

        <CardBody>
          <Stack spacing={0} align="center" mb={4}>
            <Text fontSize="xl" fontWeight="bold" textTransform="uppercase">
              {title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {subtitle}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Flex
            flexDirection={["column", "row"]} // Stack the buttons vertically on small screens and horizontally on larger screens
            justifyContent="space-between"
            alignItems="center"
            px={6}
            py={3}
          >
            <CustomCardButton
              id="details"
              type="button"
              text="Details"
              color="blue"
              mr={[0, 3]}
              onClick={() => handleClickDetail(id!)}
            />
            <CustomCardButton
              id="edit"
              type="button"
              text="Edit"
              color="green"
              mr={[0, 3]}
              onClick={() => handleClickEdit(id!)}
            />
            <CustomCardButton
              id="delete"
              type="button"
              text="Delete"
              color="red"
              mr={[0, 3]}
              onClick={() => handleClickDelete(id!)}
            />
          </Flex>
        </CardFooter>
      </Card>
    </>
  );
};

export default CustomCard;
