const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat");
const upload = require("../util/store");

const uploadField = [{ name: "image", maxCount: 1 }];

// GET all chat
router.get("/chat", chatController.getAllChat);

router.get("/chat/group", chatController.getGroupChat);

// GET chat by ID
router.get("/chat/:id", chatController.getChatById);

// GET chat by user ID
router.get("/chat/user/:id", chatController.getChatByUserId);

//Get group chat only
// router.get("/chat/group", chatController.getGroupChat);

// CREATE chat
router.post("/chat", upload.fields(uploadField), chatController.createChat);

// UPDATE chat by ID
router.put("/chat/:id", upload.fields(uploadField), chatController.updateChat);

// DELETE chat by ID
router.delete("/chat/:id", chatController.deleteChat);

//Leave chat
router.put("/chat/:id/leave/:userId", chatController.leaveChat);

module.exports = router;
