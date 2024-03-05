const express = require("express");

const router = express.Router();
const communityController = require("../controller/community");
const multer = require("multer");
// const upload = multer({ dest: 'uploads/image' });
const upload = require("../util/store");

const uploadField = [
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
];

// GET all community
router.get("/community", communityController.getAllCommunity);

// GET community by ID
router.get("/community/:id", communityController.getCommunityById);

//GET communityFeed from community
router.get("/community/:id/feed", communityController.getCommunityFeed);



//GET commmuntiy id and name
router.get("/user/:id/communities", communityController.getUserCommunities);
// router.get("/community/nameid", communityController.getCommunityIdAndName);

// CREATE community
router.post(
  "/community",
  upload.fields(uploadField),
  communityController.createCommunity
);

// UPDATE community by ID
router.put(
  "/community/:id",
  upload.fields(uploadField),
  communityController.updateCommunity
);

// DELETE community by ID
router.delete("/community/:id", communityController.deleteCommunity);

// ADD member to community
router.post("/community/:id/join", communityController.addMember);

// DELETE member from community
router.delete(
  "/community/:id/member/:member_id/leave",
  communityController.deleteMember
);

// ADD post to community
router.post(
  "/community/:id/post",
  upload.fields(uploadField),
  communityController.addPost
);

// UPDATE post to community
router.put("/community/:id/post/:post_id", communityController.updatePost);

// DELETE post from community
router.delete("/community/:id/post/:post_id", communityController.deletePost);

// ADD comment to post
router.post(
  "/community/:id/post/:post_id/comment",
  communityController.addComment
);

// DELETE comment from post
router.delete(
  "/community/:id/post/:post_id/comment/:comment_id",
  communityController.deleteComment
);

module.exports = router;
