import {
  AddIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { CheckCircleIcon } from "@chakra-ui/icons";

import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
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
  moderator?: string;
  onClick?: () => void;
  id?: string;
  tag?: any;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAdd?: (id: string) => void;
  verified?: boolean;
}

interface CustomListingProps {
  item: ListItem;
  type: "user" | "community" | "research";
}

const CustomListing: React.FC<CustomListingProps> = ({ item, type }) => {
  const bgColors = useColorModeValue("white", "gray.700");

  console.log("this is the modeator:", item.moderator);
  // console.log("this is the tag:", tag);
  console.log("this is item.tag:", item.tag);

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
              <Button
                leftIcon={<ViewIcon />}
                colorScheme="teal"
                size="sm"
                onClick={() => navigate(`/community/${item.id}`)}
              >
                View Community
              </Button>

              {userId === item.moderator && (
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<EditIcon />}
                      onClick={() => item.onEdit && item.onEdit(item.id!)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => item.onDelete && item.onDelete(item.id!)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </>
          </>
        );
      default:
        return null;
    }
  };

  const handleTagClick = (tag: string) => {
    console.log("this is the tag: ", tag);
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
            // onError={(e) => {
            //   e.currentTarget.src =
            //     // "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png";
            //     "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png";
            // }}
            objectFit="cover"
          />
        ) : (
          <Image
            src="https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"
            alt={`${item.title}'s profile`}
            height="200px"
            width="100%"
            objectFit="cover"
            // onError={(e) => {
            //   e.currentTarget.src =
            //     "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png";
            // }}
          />
        )}
        <Box p={5}>
          <Text fontWeight="bold" as="h4" lineHeight="tight" isTruncated>
            {item.title}
            {item.verified && (
              <Tooltip label="Verified" placement="top" hasArrow>
                <span>
                  <CheckCircleIcon color="green.500" ml={1} boxSize={3} />
                </span>
              </Tooltip>
            )}
          </Text>
          <Text fontSize="sm" color="gray.500" isTruncated>
            {type === "user"
              ? item.email
              : type === "community"
              ? item.status
              : item.username}
            {item.verified && (
              <Tooltip label="Verified" placement="top" hasArrow>
                <span>
                  <CheckCircleIcon color="green.500" ml={1} boxSize={3} />
                </span>
              </Tooltip>
            )}
          </Text>
          <Text mt={2} color="gray.600" isTruncated>
            {item.description}
          </Text>
        </Box>
        {type === "community" ? (
          <>
            <Flex p={5} align="center" justify="space-between">
              <>
                <Button
                  leftIcon={<ViewIcon />}
                  colorScheme="teal"
                  size="sm"
                  onClick={() => navigate(`/community/${item.id}`)}
                >
                  View Community
                </Button>

                {userId === item.moderator && (
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={() => item.onEdit && item.onEdit(item.id!)}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        icon={<DeleteIcon />}
                        onClick={() => item.onDelete && item.onDelete(item.id!)}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </>
            </Flex>
          </>
        ) : (
          <>
            <Flex p={5} align="center">
              <Box flex="1">
                {type === "user" || type === "research" ? (
                  <>
                    {item.tag && item.tag.length > 0 ? (
                      Array.isArray(item.tag) ? (
                        item.tag.slice(0, 5).map((tag, index) => (
                          <Tooltip label={`Filter by ${tag}`} key={index}>
                            <Badge
                              borderRadius="full"
                              px="2"
                              mr={5}
                              colorScheme="purple"
                              onClick={() => handleTagClick(tag)}
                            >
                              {tag}
                            </Badge>
                          </Tooltip>
                        ))
                      ) : (
                        <Tooltip label={`Filter by ${item.tag}`}>
                          <Badge
                            borderRadius="full"
                            px="2"
                            colorScheme="purple"
                          >
                            {item.tag}
                          </Badge>
                        </Tooltip>
                      )
                    ) : (
                      <Badge borderRadius="full" px="2" colorScheme="purple">
                        No tags
                      </Badge>
                    )}
                    {Array.isArray(item.tag) && item.tag.length > 5 ? (
                      <Badge borderRadius="full" px="2" colorScheme="purple">
                        +{item.tag.length - 5} more
                      </Badge>
                    ) : null}
                  </>
                ) : (
                  <Badge borderRadius="full" px="2" colorScheme="purple">
                    {item.status}
                  </Badge>
                )}
              </Box>

              <Box>{renderActions()}</Box>
            </Flex>
          </>
        )}
      </Box>
    </>
  );
};
export default CustomListing;
