import { AddIcon, ViewIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { type } from "os";
import React, { useState, useContext } from "react";

interface ListItem {
  title: string;
  subtitle?: string;
  description: string;
  username?: string;
  status?: string;
  email?: string;
  image: any;
  onClick?: () => void;
  id?: string;
  tag?: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAdd?: (id: string) => void;
}

interface CustomListingProps {
  item: ListItem;
  type: "user" | "community" | "research";
}

const CustomListing: React.FC<CustomListingProps> = ({ item, type }) => {
  const bgColors = useColorModeValue("white", "gray.700");

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const renderActions = () => {
    switch (type) {
      case "user":
        return (
          <Button
            leftIcon={<ViewIcon />}
            colorScheme="blue"
            size="sm"
            onClick={() => {
              navigate(`/network/${item.id}`);
            }}
          >
            View Profile
          </Button>
        );
      case "research":
        return (
          <Button
            leftIcon={<ViewIcon />}
            colorScheme="green"
            size="sm"
            onClick={() => {
              navigate(`/research/${item.id}`);
            }}
          >
            View Research
          </Button>
        );
      case "community":
        return (
          <>
            <>
              {userId !== item.id && (
                <Button
                  leftIcon={<ViewIcon />}
                  colorScheme="teal"
                  size="sm"
                  onClick={() => navigate(`/community/${item.id}`)}
                >
                  View Community
                </Button>
              )}

              {userId === item.id && (
                <>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => item.onEdit && item.onEdit(item.id!)}
                  >
                    Edit
                  </Button>
                  <Button
                    leftIcon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => item.onDelete && item.onDelete(item.id!)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </>
            {/* <Button
              leftIcon={<ViewIcon />}
              colorScheme="teal"
              size="sm"
              onClick={() => {
                navigate(`/community/${item.id}`);
              }}
            >
              View Community
            </Button>
            {userId === item.id && (
              <Button
                leftIcon={<EditIcon />}
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  item.onEdit!(item.id!);
                }}
              >
                Edit
              </Button>
            )}
            {userId === item.id && (
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                size="sm"
                onClick={() => {
                  item.onDelete!(item.id!);
                }}
              >
                Delete
              </Button>
            )} */}
          </>
        );
      default:
        return null;
    }
  };


  const imagePath = item.image;
  // console.log("this is the imagePath: ", imagePath);

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        mb={4}
        bg={bgColors}
      >
        {imagePath ? (
          <Image
            src={`http://localhost:4000/${item.image}`}
            alt={`${item.title}'s profile`}
            height="200px"
            width="100%"
            onError={(e) => {
              e.currentTarget.src =
                "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png";
            }}
            objectFit="cover"
          />
        ) : (
          <Image
            src="https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"
            alt={`${item.title}'s profile`}
            height="200px"
            width="100%"
            objectFit="cover"
          />

        )}
        <Box p={5}>
          <Text fontWeight="bold" as="h4" lineHeight="tight" isTruncated>
            {item.title}
          </Text>
          <Text fontSize="sm" color="gray.500" isTruncated>
            {type === "user"
              ? item.email
              : type === "community"
              ? item.status
              : item.username}
          </Text>
          <Text mt={2} color="gray.600" isTruncated>
            {item.description}
          </Text>
        </Box>
        <Flex p={5} align="center" justify="space-between">
          {type === "user" || type === "research" ? (
            <>
              {item.tag && item.tag.length > 0 ? (
                Array.isArray(item.tag) ? (
                  item.tag.map((tag) => (
                    <Badge borderRadius="full" px="2" colorScheme="purple">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <Badge borderRadius="full" px="2" colorScheme="purple">
                    {item.tag}
                  </Badge>
                )
              ) : (
                <Badge borderRadius="full" px="2" colorScheme="purple">
                  No tags
                </Badge>
              )}
            </>
          ) : null}

          {renderActions()}
        </Flex>
      </Box>
    </>
  );
};
export default CustomListing;
