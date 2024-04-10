const Message = require("../model/message");
const Chat = require("../model/chat");

const socketController = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected");

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

        console.log("this is the message: ", message);

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
          chatName: ""
        });

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

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = socketController;
