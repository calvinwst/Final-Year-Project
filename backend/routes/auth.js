const express = require("express");
const router = express.Router();

const authController = require("../controller/auth");

router.post("/register", authController.register);

router.get("/logout", authController.logout);

router.post("/login", authController.login);

// router.post

// Path: backend/routes/auth.js

module.exports = router;
