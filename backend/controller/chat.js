const Chat = require("../model/chat");
const Message = require("../model/message");

//Get all chat
exports.getAllChat = (req, res) => {
  Chat.find()
    .populate(
      "users",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .populate("messages")
    .then((chat) => {
      //   res.status(200).json(chat, "Get all Chat successfully!");
      res
        .status(200)
        .json({ chat: chat, message: "Get all Chat successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.toString() });
    });
};

//GET GROUP CHAT ONLY
exports.getGroupChat = (req, res) => {
  Chat.find({ isGroupChat: true })
    .populate(
      "users",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .populate("messages")
    .then((chat) => {
      res
        .status(200)
        .json({ chat: chat, message: "Get all Group Chat successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.toString() });
    });
};

//Get chat by ID
exports.getChatById = (req, res) => {
  if (req.params.id === "undefined") {
    console.log("this is the id: ", req.params.id);
    res.status(400).json({
      message: "Chat ID is undefined",
    });
  }

  Chat.findById(req.params.id)
    .populate(
      "users",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .then((chat) => {
      if (!chat) {
        return res.status(404).json({
          error: "Chat not found!",
        });
      } else {
        res.status(200).json({
          chat: chat,
          message: "Get Chat by ID successfully!",
        });
      }
    })
    .catch((error) => {
      res.status(404).json({
        error: error.toString(),
      });
    });
};

//Get chat by user ID
exports.getChatByUserId = (req, res) => {
  Chat.find({ users: req.params.id })
    .populate(
      "users",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .populate("messages", "content sender")
    .populate({
      path: "messages",
      populate: {
        path: "sender",
        select:
          "username profile.firstName profile.lastName profile.profileImgPath",
      },
    })
    .populate({
      path: "messages",
      populate: {
        path: "readBy",
        select:
          "username profile.firstName profile.lastName profile.profileImgPath",
      },
    })
    // .populate({
    //   path: "messages",
    //   populate: {
    //     path: "chat",
    //     select: "chatName",
    //   },
    // })

    .then((chat) => {
      if (!chat) {
        return res.status(404).json({
          error: "Chat not found!",
        });
      } else {
        res.status(200).json({
          chat: chat,
          message: "Get Chat by User ID successfully!",
        });
      }
    })
    .catch((error) => {
      res.status(404).json({
        error: error.toString(),
      });
    });
};

// Create chat


exports.createChat = (req, res) => {
  const { users, chatName, groupAdmin } = req.body;
  const image = req.files && req.files.image ? req.files.image[0].path : null;

  //parse USERS
  const parsedUsers = JSON.parse(users);

  //check if a chat with the sme users already exists
  Chat.findOne({ users: { $all: parsedUsers } })
    .then((existingChat) => {
      if (existingChat) {
        return res.status(200).json({
          message: "Chat already exists!",
          chat: existingChat,
        });
      } else {
        // If no chat with the same users exists, create a new chat
        const chatData =
          users.length > 2
            ? {
                users: parsedUsers,
                chatName,
                isGroupChat: true,
                chatImgPath: image,
                groupAdmin,
              }
            : {
                users: parsedUsers,
                chatName,
              };
        Chat.create(chatData)
          .then((chat) => {
            res.status(201).json({
              message: "Chat created successfully!",
              chat: chat,
            });
          })
          .catch((error) => {
            res.status(400).json({
              error: error.toString(),
            });
          });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error.toString(),
      });
    });
};

//Update chat
exports.updateChat = async (req, res) => {
  let { users, chatName } = req.body;
  const image = req.files && req.files.image ? req.files.image[0].path : null;

  console.log("this is the image: ", image);
  console.log("this is the user: ", users);
  console.log("length of the user ", users.length);

  if (typeof users === "string") {
    const parsedUsers = JSON.parse(users);
    users = parsedUsers;
  }

  // Fetch the chat group
  const chatGroup = await Chat.findById(req.params.id);

  let updateData = {
    chatName,
  };


  if (image) {
    updateData.chatImgPath = image;
  }

  if (users.length > 0) {
    // Check if the user is already in the chat group
    const userIsInChatGroup = chatGroup.users.some((userId) =>
      users.includes(userId.toString())
    );

    if (userIsInChatGroup) {
      return res.status(400).json({
        error: "User is already in the chat group",
      });
    }

    updateData.$push = { users: { $each: users } };
    if (users.length > 2) {
      updateData.isGroupChat = true;
      updateData.chatImgPath = image;
    }
  }

  Chat.updateOne({ _id: req.params.id }, updateData)
    .then(() => {
      res.status(200).json({
        message: "Chat updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.toString(),
      });
    });
};

//Delete chat by ID
exports.deleteChat = (req, res) => {
  Chat.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "Chat deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.toString(),
      });
    });
};
