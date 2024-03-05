const express = require("express");
const router = express.Router();

const authController = require("../controller/auth");

router.post("/register", authController.register);

router.get("/logout", authController.logout);

router.post("/login", authController.login);

router.put("/reset-password/:id", authController.resetPassword);

router.get("/verify-email/:token", authController.verifyEmail);

router.post("/reset-password-link", authController.sendResetPasswordEmail);

router.post("/google", authController.googleLogin);

router.post("/google/callback", authController.googleLoginCallback);

router.post("/email-verification-link", authController.sendEmailVerification);

module.exports = router;
