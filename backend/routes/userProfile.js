const express = require("express");

const router = express.Router();
const userProfileController = require("../controller/userProfile");
const upload = require("../util/store");

const uploadField = [{ name: "image", maxCount: 1 }];

// GET user profile by ID
router.get("/users/:id", userProfileController.getUserProfileById);

// Get all user profiles
router.get("/users", userProfileController.getAllUserProfiles);

// Add user profile image
router.post(
  "/users/:id/image",
  upload.fields(uploadField),
  userProfileController.addUserProfileImage
);

// UPDATE user profile image]
router.put(
  "/users/:id/image",
  upload.fields(uploadField),
  userProfileController.updateUserProfileImage
);



// UPDATE user profile by ID
router.put("/users/:id", userProfileController.updateUserProfileById);

// DELETE user profile by ID
router.delete("/users/:id", userProfileController.deleteUserProfileById);

// GET experience by user profile ID
router.get("/users/:id/experience", userProfileController.getExperience);

// ADD experience to user profile
router.post("/users/:id/experience", userProfileController.addExperience);
// UPDATE user experience
router.put(
  "/users/:id/experience/:exp_id",
  userProfileController.updateExperience
);

// DELETE user experience
router.delete(
  "/users/:id/experience/:exp_id",
  userProfileController.deleteExperience
);

//GET education by user profile ID
router.get("/users/:id/education", userProfileController.getEducation);

// ADD education to user profile
router.post("/users/:id/education", userProfileController.addEducation);

// UPDATE user education
router.put(
  "/users/:id/education/:edu_id",
  userProfileController.updateEducation
);

// DELETE user education
router.delete(
  "/users/:id/education/:edu_id",
  userProfileController.deleteEducation
);

// GET skills to user profile
router.get("/users/:id/skills", userProfileController.getSkills);

// ADD skills to user profile
router.post("/users/:id/skills", userProfileController.addSkills);

// UPDATE user skills
router.put("/users/:id/skills/:skill_id", userProfileController.updateSkills);

// DELETE user skills
router.delete(
  "/users/:id/skills/:skill_id",
  userProfileController.deleteSkills
);

//Get all user notification by user profile ID
router.get("/users/:id/notifications", userProfileController.getAllNotificationById);

//PATCH user notification by user profile ID
router.patch("/users/:id/notifications/:notification_id/read", userProfileController.markAsRead);

//NUMBER of unread notifications by user profile ID
// router.get("/users/:id/notifications/unread", userProfileController.getUnreadNotification);

//Get all User connections by user profile ID
router.get("/users/:id/connections", userProfileController.getAllConnections);

// ADD license to user profile
// router.post("/users/:id/license", userProfileController.addLicense);

// UPDATE user license
// router.put("/users/:id/license/:license_id", userProfileController.updateLicense);

// DELETE user license
// router.delete("/users/:id/license/:license_id", userProfileController.deleteLicense);

module.exports = router;
