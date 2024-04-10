const UserFeed = require("../model/userFeed");
const User = require("../model/user");
//Get all userFeed
exports.getAllUserFeed = (req, res) => {
  UserFeed.find()
    .populate(
      "user",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .populate(
      "comment.user",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .then((userFeed) => {
      res.status(200).json(userFeed);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//Get userFeed by ID
exports.getUserFeedById = (req, res) => {
  UserFeed.findById(req.params.id)
    .populate(
      "user",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .populate(
      "comment.user",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .then((userFeed) => {
      res.status(200).json(userFeed);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Create userFeed
exports.createUserFeed = (req, res) => {
  const { content, user } = req.body;
  // const image = req.files.image;
  let image = req.files && req.files.image ? req.files.image[0].path : null;

  console.log("this is the image: ", image);

  UserFeed.create({
    content,
    user,
    multimediaContent: image,
    postType: "personal",
  })
    .then(() => {
      res.status(201).json({
        message: "userFeed created successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Update userFeed by ID
exports.updateUserFeed = (req, res) => {
  const { content } = req.body;
  let updateData = { content, isEdited: true };
  console.log("this is the updateData: ", updateData);
  if (req.files && req.files.image) {
    const image = req.files.image[0].path;
    updateData.multimediaContent = image;
  }

  UserFeed.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then(() => {
      res.status(200).json({
        message: "userFeed updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Delete userFeed by ID
exports.deleteUserFeed = (req, res) => {
  UserFeed.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "userFeed deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};


exports.addLike = (req, res) => {
  const userId = req.body.userId;

  // Find the user who liked the post
  User.findById(userId)
    .then((user) => {
      // Update the UserFeed document
      UserFeed.findByIdAndUpdate(req.params.id, {
        $addToSet: { like: [userId] },
      })
        .populate(
          "user",
          "username profile.firstName profile.lastName profile.profileImgPath"
        )
        .then((updateUserFeed) => {
          console.log("this is the updated userFeed: ", updateUserFeed);

          // Create a notification
          const notification = {
            message: `${user.username} liked your post`,
            link: `/userfeed/${req.params.id}`,
            read: false,
          };

          // Update the user who received the like
          User.findByIdAndUpdate(
            updateUserFeed.user._id,
            {
              $push: { notifications: notification },
            },
            { new: true }
          ).then((user) => {
            console.log("Notification added successfully!");
          });

          res.status(200).json({
            message: "Like added successfully!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Delete like from userFeed
exports.deleteLike = (req, res) => {
  // const userId = req.body.userId;

  UserFeed.findByIdAndUpdate(req.params.id, {
    $pull: { like: req.params.userId },
  })
    .then(() => {
      res.status(200).json({
        message: "Like deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Add comment to userFeed
exports.addComment = (req, res) => {
  console.log("this is the req.bodyuser: ", req.body.user);
  const comment = {
    user: req.body.user,
    content: req.body.content,
  };
  UserFeed.findByIdAndUpdate(
    req.params.id,
    {
      $push: { comment: comment },
    },
    { new: true }
  )
    .populate(
      "user",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .populate(
      "comment.user",
      "username profile.lastName profile.profileImgPath"
    )


    .then((updatedUserFeed) => {
      const lastComment =
        updatedUserFeed.comment[updatedUserFeed.comment.length - 1];
      console.log("this is the last comment: ", lastComment);
      const notification = {
        message: `${lastComment.user.username} commented on your post`,
        link: `/userfeed/${req.params.id}`,
        read: false,
      };

      User.findByIdAndUpdate(
        updatedUserFeed.user._id,
        {
          $push: { notifications: notification },
        },
        { new: true }
      ).then((user) => {
        console.log("Notification added successfully!");
      });

      res.status(200).json({
        message: "Comment added successfully!",
        comment: updatedUserFeed.comment[updatedUserFeed.comment.length - 1], // Return the last comment from the updated document
      });

    
    })
    .catch((error) => {
      res.status(400).json({
        error: error.toString(),
      });
    });
};



//Delete commnet from userFeed
exports.deleteComment = (req, res) => {
  UserFeed.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { comment: { _id: req.params.comment_id } },
    },
    {
      new: true,
    }
  )
    .populate(
      "comment.user",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .then((updatedUserFeed) => {
      res.status(200).json({
        message: "Comment deleted successfully!",
        comment: updatedUserFeed.comment,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.toString(),
      });
      console.log("thius is th e error >>>", error.toString());
    });
};
