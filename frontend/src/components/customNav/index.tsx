import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spacer,
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { CustomStylesNav } from "./styles";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { IoPeopleOutline } from "react-icons/io5";
import NotificationBubble from "./NotificationBubble";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface Notification {
  message: string;
  link: string;
  read: boolean;
  _id: string;
}

const CustomNav = () => {
  const isNotSmallerScreen = useBreakpointValue({ base: false, md: true });
  const [imageFilePath, setImageFilePath] = React.useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notification, setNotification] = useState<Notification[]>([]);
  const [countNotification, setCountNotification] = useState(0);
  const auth = useContext(AuthContext);
  const { token, unreadNotifications, userId } = useContext(AuthContext);
  // const userId = auth.userId;

  console.log("this is userId", userId);
  console.log("this si the unreadNotifications", unreadNotifications);

  useEffect(() => {
    fetchUserDetail();
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      query: { token },
    });
    setSocket(newSocket);

    newSocket.on("unread-notification-count", (count: number) => {
      setCountNotification(count);
    });

    newSocket.on("notification-read", () => {
      setCountNotification((count) => count - 1);
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  console.log("this is countNotification", countNotification);

  const fetchUserDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/${userId}`,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      console.log("this is response", response);
      setImageFilePath(response.data.profile.profileImgPath);
    } catch (err) {
      console.log("Error fetching user details", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/${userId}/notifications`,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      setNotification(response.data);
    } catch (err) {
      console.log("Error fetching notifications", err);
    }
  };

  // const unreadNotifications = notification.filter((n) => !n.read);

  const filePath = `http://localhost:4000/${imageFilePath}`;

  return (
    <>
      <CustomStylesNav>
        <Box
          as={RouterLink}
          to="/"
          fontSize="2xl"
          fontWeight="semibold"
          color="white"
        >
          Home
        </Box>

        {auth.isLogged ? (
          <Flex
            px={4}
            py={2}
            alignItems="center"
            justifyContent={isNotSmallerScreen ? "space-between" : "center"}
            flexDirection={isNotSmallerScreen ? "row" : "column"}
          >
            <Stack
              direction={isNotSmallerScreen ? "row" : "column"}
              spacing={5}
              align="center"
            >
              <Box as={RouterLink} to="/research">
                Research/Case Listing
              </Box>
              <Box as={RouterLink} to="/notification">
                <NotificationBubble count={countNotification} />
              </Box>
              <Flex as={RouterLink} to="/network" alignItems="center">
                <IoPeopleOutline />
                <Spacer />
                <Box>Network</Box>
              </Flex>
              <Box as={RouterLink} to="/communityProfile">
                Community
              </Box>
              <Box as={RouterLink} to="/chat">
                Message
              </Box>
            </Stack>

            <Menu>
              <MenuButton as={Button} colorScheme="teal">
                <Avatar
                  size="sm"
                  // name="Dan Abrahmov"
                  // src="https://bit.ly/dan-abramov"
                  src={filePath}
                />
              </MenuButton>
              <MenuList>
                <MenuGroup color={"black"} title="Profile">
                  <MenuItem color={"black"} as={RouterLink} to="/userProfile">
                    <Text
                      color="black"
                      style={{
                        textDecoration: "none",
                        fontSize: "0.8rem",
                        fontFamily: "sans-serif",
                      }}
                    >
                      My Account
                    </Text>
                  </MenuItem>
                  <MenuItem color={"black"} onClick={auth.logout}>
                    Logout
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup color={"black"} title="Help">
                  <MenuItem color={"black"}>Docs</MenuItem>
                  <MenuItem
                    as={RouterLink}
                    to="/setting"
                    style={{ color: "black !important" }}
                  >
                    <Text
                      color="black"
                      style={{
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        fontFamily: "sans-serif",
                      }}
                    >
                      Setting
                    </Text>
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <Box
            as={RouterLink}
            to="/login"
            fontSize="2xl"
            fontWeight="semibold"
            color="white"
          >
            Login
          </Box>
        )}
      </CustomStylesNav>
    </>
  );
};

export default CustomNav;
