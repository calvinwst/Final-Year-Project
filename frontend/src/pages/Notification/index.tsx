import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  List,
  ListItem,
  Button,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MdEmail, MdCheckCircle } from "react-icons/md"; // Example icons
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Socket, io } from "socket.io-client";

const Notification = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { userId, decreaseUnreadNotificationsCount, token } =
    useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      query: { token },
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/users/${userId}/notifications`,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      setNotifications(response.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await axios.patch(
        `http://localhost:4000/users/${userId}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      socket?.emit("notification-read", { notificationId });
      console.log("Notification marked as read");
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (notifications.length === 0) {
    return (
      <>
        <Box p={5}>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={5}>
            Notifications
          </Text>
          <Text textAlign="center">No New Notifications</Text>
        </Box>
      </>
    );
  }

  return (
    <Box p={5} mt={16}>
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={5}>
        Notifications
      </Text>
      <List spacing={3}>
        {notifications.filter((notification) => !notification.read).length >
        0 ? (
          notifications
            .filter((notification) => !notification.read)
            .map((notification) => (
              <ListItem
                key={notification._id}
                p={3}
                _hover={{ bg: "gray.100" }}
              >
                <Flex align="center">
                  <Icon as={MdEmail} mr={2} /> {/* Example icon */}
                  <Link to={notification.link}>
                    <Text isTruncated>{notification.message}</Text>
                  </Link>
                  <Button
                    size="sm"
                    ml="auto"
                    onClick={() => {
                      handleMarkAsRead(notification._id);
                    }}
                  >
                    Mark as Read
                  </Button>{" "}
                  {/* Example action */}
                </Flex>
              </ListItem>
            ))
        ) : (
          <Text> No Notification</Text>
        )}
      </List>
    </Box>
  );
};

export default Notification;
