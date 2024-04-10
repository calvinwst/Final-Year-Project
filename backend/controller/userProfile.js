const User = require("../model/user");

// GET all user profiles
exports.getAllUserProfiles = async (req, res) => {
  try {
    const userProfiles = await User.find();
    res.json(userProfiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET request to retrieve a user profile by ID
exports.getUserProfileById = async (req, res) => {
  try {
    const id = req.params.id;

    User.findById(id)
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Add user profile image
exports.addUserProfileImage = async (req, res) => {
  try {
    const id = req.params.id;
    User.findById(id)
      .then((user) => {
        if (user) {
          const image = req.files.image[0];
          user.profile.profileImgPath = image.path;
          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Upadate user profile image
exports.updateUserProfileImage = async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.files.image[0];

    User.findById(id)
      .then((users) => {
        if (users) {
          users.profile.profileImgPath = image.path;
          users.save().then((users) => res.json(users));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET request to retrieve a user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userProfile = await User.findById(id);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE request to delete a user profile by ID
exports.deleteUserProfileById = async (req, res) => {
  try {
    const userProfile = await User.findById(req.params.id);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    await userProfile.remove();
    res.json({ message: "User profile deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT request to update a user profile by ID
exports.updateUserProfileById = async (req, res) => {
  try {
    // const { name, age, gender, bio } = req.body;
    const { firstName, lastName, location, specialty, about } = req.body;
    console.log(req.body);
    const userProfile = await User.findById(req.params.id);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    userProfile.profile.firstName = firstName;
    userProfile.profile.lastName = lastName;
    userProfile.profile.location = location;
    userProfile.profile.specialty = specialty;
    userProfile.profile.about = about;
    await userProfile.save();
    res.json(userProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET experience by user profile ID
exports.getExperience = async (req, res) => {
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          res.status(200).json(user.experience);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD experience to user profile
exports.addExperience = async (req, res) => {

  try {
    const experienceData = req.body;
    console.log(experienceData);

    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          // Add each experience object to the user's experience array
          for (const experience of experienceData) {
            const {
              title,
              company,
              location,
              startDate,
              endDate,
              description,
            } = experience;
            const newExperience = {
              title,
              company,
              location,
              startDate,
              endDate,
              description,
            };

            if (user.experience.length > 0) {
              user.experience.unshift(newExperience);
            } else {
              user.experience.push(newExperience);
            }
          }

          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE user experience
exports.updateExperience = async (req, res) => {
  // TODO: Implement this function
  const { title, company, location, startDate, endDate, description } =
    req.body;
  console.log("this is req.body", req.body);
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          const updateIndex = user.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);
          if (title) user.experience[updateIndex].title = title;
          if (company) user.experience[updateIndex].company = company;
          if (location) user.experience[updateIndex].location = location;
          if (startDate) user.experience[updateIndex].startDate = startDate;
          if (endDate) user.experience[updateIndex].endDate = endDate;
          if (description)
            user.experience[updateIndex].description = description;
          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE user experience
exports.deleteExperience = async (req, res) => {
  // TODO: Implement this function
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          const removeIndex = user.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);
          user.experience.splice(removeIndex, 1);
          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//GET education by user profile ID
exports.getEducation = async (req, res) => {
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          res.status(200).json(user.medicalEducation);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.addEducation = async (req, res) => {
  try {
    const educationData = req.body;
    console.log(educationData);

    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          // Add each education object to the user's medicalEducation array
          for (const education of educationData) {
            const { medicalDegree, medicalSchool, residency, fellowship } =
              education;
            const newEducation = {
              medicalDegree,
              medicalSchool,
              residency,
              fellowship,
            };

            if (user.medicalEducation.length > 0) {
              user.medicalEducation.unshift(newEducation);
            } else {
              user.medicalEducation.push(newEducation);
            }
          }

          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE user education
exports.updateEducation = async (req, res) => {
  // TODO: Implement this function
  const { medicalDegree, medicalSchool, residency, fellowship } = req.body;
  console.log(req.body);
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          const updateIndex = user.medicalEducation
            .map((item) => item.id)
            .indexOf(req.params.edu_id);
          if (medicalDegree)
            user.medicalEducation[updateIndex].medicalDegree = medicalDegree;
          if (medicalSchool)
            user.medicalEducation[updateIndex].medicalSchool = medicalSchool;
          if (residency)
            user.medicalEducation[updateIndex].residency = residency;
          if (updateIndex)
            user.medicalEducation[updateIndex].fellowship = fellowship;
          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE user education
exports.deleteEducation = async (req, res) => {
  // TODO: Implement this function
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          const removeIndex = user.medicalEducation
            .map((item) => item.id)
            .indexOf(req.params.edu_id);
          user.medicalEducation.splice(removeIndex, 1);
          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET skills to user profile
exports.getSkills = async (req, res) => {
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          res.status(200).json(user.skills);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD skills to user profile
exports.addSkills = async (req, res) => {
  const { name, level } = req.body;
  console.log(req.body);
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          const newSkill = {
            name,
            level,
          };
          if (user.skills.length > 0) {
            user.skills.unshift(newSkill);
          } else {
            user.skills.push(newSkill);
          }
          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE user skills
exports.updateSkills = async (req, res) => {
  // TODO: Implement this function
  const { name, level } = req.body;
  console.log(req.body);
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          const updateIndex = user.skills
            .map((item) => item.id)
            .indexOf(req.params.skill_id);
          if (updateIndex === -1) {
            return res.status(404).json({ message: "Skill not found" });
          }
          if (name) user.skills[updateIndex].name = name;
          if (level) user.skills[updateIndex].level = level;

          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE user skills
exports.deleteSkills = async (req, res) => {
  // TODO: Implement this function
  try {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          const removeIndex = user.skills
            .map((item) => item.id)
            .indexOf(req.params.skill_id);
          user.skills.splice(removeIndex, 1);
          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Getting all notifications
exports.getAllNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    User.findById(id)
      .then((user) => {
        if (user) {
          res.status(200).json(user.notifications);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Marking a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id, notification_id } = req.params;
    await User.findById(id)
      .then((user) => {
        if (user) {
          const updateIndex = user.notifications
            .map((item) => item.id)
            .indexOf(notification_id);
          if (updateIndex === -1) {
            return res.status(404).json({ message: "Notification not found" });
          }
          user.notifications[updateIndex].read = true;
          user.save().then((user) => res.json(user));
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get all connections of a user
exports.getAllConnections = async (req, res) => {
  try {
    const { id } = req.params;
    User.findById(id)
      .populate("connections", "username")
      .then((user) => {
        if (user) {
          res.status(200).json(user.connections);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // ADD license to user profile
// exports.addLicense = async (req, res) => {
//   // TODO: Implement this function
// };

// // UPDATE user license
// exports.updateLicense = async (req, res) => {
//   // TODO: Implement this function
// };

// DELETE user license
// exports.deleteLicense = async (req, res) => {
//   // TODO: Implement this function
// };
