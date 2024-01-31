const express = require("express");
const router = express.Router();
const userFeedController = require("../controller/userFeed");
const checkAuth = require("../middleware/check-auth");
const upload = require("../util/store");

const uploadField = [
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
];

// GET all userFeed
router.get("/userFeed", userFeedController.getAllUserFeed);

// GET userFeed by ID
router.get("/userFeed/:id", userFeedController.getUserFeedById);

//Use checkAuth middleware to protect routes
// router.use(checkAuth);

// CREATE userFeed
router.post(
  "/userFeed",
  upload.fields(uploadField),
  userFeedController.createUserFeed
);

// UPDATE userFeed by ID
router.put(
  "/userFeed/:id",
  upload.fields(uploadField),
  userFeedController.updateUserFeed
);

// DELETE userFeed by ID
router.delete("/userFeed/:id", userFeedController.deleteUserFeed);

// ADD like to userFeed
router.post("/userFeed/:id/like", userFeedController.addLike);

// DELETE like from userFeed
router.delete("/userFeed/:id/unlike/:userId", userFeedController.deleteLike);
// ADD comment to userFeed
router.post("/userFeed/:id/comment", userFeedController.addComment);

// DELETE comment from userFeed
router.delete(
  "/userFeed/:id/comment/:comment_id",
  userFeedController.deleteComment
);

module.exports = router;
