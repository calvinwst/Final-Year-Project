const Message = require("../model/message");
const Chat = require("../model/chat");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

const socketController = (io) => {
  async function createNotification(senderId, receiverId, message) {
    const sender = await User.findById(senderId);
    const notification = {
      message: "New Message from " + sender.username,
      link: "/chat/",
      read: false,
    };

    try {
      const user = await User.findByIdAndUpdate(
        receiverId,
        {
          $push: { notifications: notification },
        },
        { new: true }
      );
      console.log("Notification added successfully!");
    } catch (error) {
      console.log("this is the error: ", error.toString());
    }
  }

  async function emitUnreadNotificationCount(userID) {
    try {
      const user = await User.findById(userID);
      if (!user) {
        console.log("User not found!");
        return;
      }
      const unreadNotifications = user.notifications.filter(
        (notification) => !notification.read
      ).length;
      console.log("Unread notifications: ", unreadNotifications);
      io.to(`userRoom-${userID}`).emit(
        "unread-notification-count",
        unreadNotifications
      );
    } catch (error) {
      console.log(
        "this is the error in unreadnotification:  ",
        error.toString()
      );
    }
  }

  io.on("connection", (socket) => {
    //authentication user
    const token = socket.handshake.query.token;
    console.log("this is the token: ", token);
    //verify token
    try {
      const decodedToken = jwt.verify(token, "secretion");
      socket.userId = decodedToken.userId;
      socket.join(`userRoom-${socket.userId}`); // Join user-specific room
      console.log(`User ${socket.userId} authenticated and joined their room`);
      if (socket.userId) {
        emitUnreadNotificationCount(socket.userId);
      }
      // emitUnreadNotificationCount(socket.userId, io);
    } catch (error) {
      console.log("this is the error in the connection: ", error.toString());
    }

    socket.on("sendMessage", async (data) => {
      // Handle sendMessage event
      try {
        const { chatId, content, senderId } = data;
        console.log("this is the data: ", data);
        const chat = await Chat.findById(chatId);
        const message = await Message.create({
          chat: chatId,
          sender: senderId,
          content: content,
        });
        chat.messages.push(message._id);
        message.populate(
          "sender",
          "profile.firstName profile.lastName profile.profileImgPath username"
        );
        message.populate("chat", "chatName isGroupChat chatImgPath");

        const receiverId = chat.users.filter((id) => id != senderId)[0];
        //notification
        await createNotification(senderId, receiverId, content);

        await chat.save();
        io.emit("newMessage", message); // Emit the message to all connected clients
      } catch (error) {
        console.log("this is the error: ", error.toString());
      }
    });

    socket.on("messageRead", async (messageId) => {
      // Handle messageRead event
      try {
        const message = await Message.findById(messageId);
        message.readBy.push(socket.user._id);
        await message.save();
        socket.emit("messageRead >>> ", message);
      } catch (error) {
        console.log("this is the error: ", error.toString());
      }
    });

    socket.on("directMessage", async (data) => {
      // Handle directMessage event
      try {
        const { senderId, receiverId, content } = data;
        //create new chat wihtout the chatname and message
        console.log("this is receiver id: ", receiverId);
        const chat = await Chat.create({
          isGroupChat: false,
          users: [senderId, receiverId],
          chatName: "",
        });

        //notification
        await createNotification(senderId, receiverId, content);

        const message = await Message.create({
          chat: chat._id,
          sender: senderId,
          content: content,
        });
        chat.messages.push(message._id);
        message.populate(
          "sender",
          "profile.firstName profile.lastName profile.profileImgPath username"
        );
        message.populate("chat", "chatName isGroupChat chatImgPath");
        await chat.save();
        io.emit("newMessage", message); // Emit the message to all connected clients
      } catch (error) {
        console.log("this is the error: ", error.toString());
      }
    });

    //send shared post id link to the receiver
    socket.on("sharePost", async (data) => {
      try {
        const { senderId, receiverId, postId } = data;
        console.log("this is the postId", postId);
        console.log("this is the senderId", senderId);
        console.log("this is the receiverId", receiverId);
        let chat = await Chat.findOne({
          isGroupChat: false,
          users: { $all: [senderId, receiverId] },
          groupAdmin: senderId,
        });

        if (!chat) {
          chat = await Chat.create({
            isGroupChat: false,
            users: [senderId, receiverId],
            chatName: "Shared Post",
          });
        }
        const message = await Message.create({
          chat: chat._id,
          sender: senderId,
          content: postId,
        });
        chat.messages.push(message._id);
        message.populate(
          "sender",
          "profile.firstName profile.lastName profile.profileImgPath username"
        );
        message.populate("chat", "chatName isGroupChat chatImgPath");
        await chat.save();
        io.emit("newMessage", message); // Emit the message to all connected clients
      } catch (error) {
        console.log("this is the error: ", error.toString());
      }
    });

    //Listen for the 'notification-read' event
    socket.on("notification-read", async ({ notificationId }) => {
      try {
        const user = await User.findOne({
          "notifications._id": notificationId,
        });
        if (!user) {
          console.log("User not found notification-read!");
          return;
        }

        //Mark the notification as read
        const notification = user.notifications.id(notificationId);
        notification.read = true;
        await user.save();

        const unreadNotifications = user.notifications.filter(
          (notification) => !notification.read
        ).length;
        io.to(`userRoom-${socket.userId}`).emit(
          "unread-notification-count",
          unreadNotifications
        );
      } catch (error) {
        console.log(
          "this is the error in notification-read: ",
          error.toString()
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = socketController;
