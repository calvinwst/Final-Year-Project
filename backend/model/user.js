const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileImgPath: { type: String },
  about: { type: String },
  location: { type: String },
  specialty: { type: String },

  // website: { type: String },
});

const userMedicalQualifySchema = new mongoose.Schema({
  medicalDegree: { type: String, required: true },
  medicalSchool: { type: String, required: true },
  residency: { type: String }, 
  fellowship: { type: String },
});

const userExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
});

const userSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    required: true,
  },
});

const notificationSchema = new mongoose.Schema({
  message: String,
  link: String,
  read: { type: Boolean, default: false },
});

const emailVerification = new mongoose.Schema({
  token: { type: String, required: true },
  expires: Date,
  verified: { type: Boolean, default: false },
  
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: userProfileSchema, required: true },
  experience: { type: [userExperienceSchema] },
  medicalEducation: { type: [userMedicalQualifySchema] },
  skills: { type: [userSkillSchema] },
  notifications: { type: [notificationSchema] },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  emailVerification: { type: emailVerification },

  // licenses: { type: [userLicenseSchema] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
