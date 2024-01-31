const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
// const upload = require('../util/store');
// const { upload, uploadImg } = require('../util/store');
const upload = require("../util/store");

const uploadField = [
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
];

// const userController = require('../controller/user');
const researchController = require("../controller/research");

// GET all research
router.get("/research", researchController.getAllResearch);

// GET research by ID
router.get("/research/:id", researchController.getResearchById);

//Use checkAuth middleware to protect routes
// router.use(checkAuth);

// CREATE research
router.post(
  "/research",
  upload.fields(uploadField),
  researchController.createResearch
);

// UPDATE research by ID
router.put("/research/:id", researchController.updateResearch);

// DELETE research by ID
router.delete("/research/:id", researchController.deleteResearch);

module.exports = router;
