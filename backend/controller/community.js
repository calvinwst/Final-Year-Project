const Community = require("../model/community");
const User = require("../model/user");
const UserFeed = require("../model/userFeed");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

//GET all community profile
exports.getAllCommunity = (req, res) => {
  Community.find()
    .then((community) => {
      res.status(200).json(community);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Get community by ID
// exports.getCommunityById = (req, res) => {
//   Community.findById(req.params.id)
//     .populate({
//       path: "communityFeed",
//       model: "userFeed", // use the same case as in your model definition
//       populate: {
//         path: "user",
//         model: "User",
//         select:
//           "username profile.firstName profile.lastName profile.profileImgPath",
//       },

//     })
//     .populate(
//       "member",
//       "username profile.firstName profile.lastName profile.profileImgPath"
//     )

//     .then((community) => {
//       res.status(200).json(community);
//     })
//     .catch((error) => {
//       res.status(400).json({
//         error: error.toString(),
//       });
//     });
// };
exports.getCommunityById = (req, res) => {
  Community.findById(req.params.id)
    .populate({
      path: "communityFeed",
      model: "userFeed",
      populate: [
        {
          path: "user",
          model: "User",
          select:
            "username profile.firstName profile.lastName profile.profileImgPath",
        },
        {
          path: "comment.user",
          model: "User",
          select:
            "username profile.firstName profile.lastName profile.profileImgPath",
        },
      ],
    })
    .populate(
      "member",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .then((community) => {
      res.status(200).json(community);
    })
    .catch((error) => {
      res.status(400).json({
        error: error.toString(),
      });
    });
};

// can i get community that contain specific user id
exports.getUserCommunities = (req, res) => {
  const userId = req.params.id;
  console.log("this is userId ", userId);
  Community.find({ member: { $in: [userId] } })
    .populate({
      path: "communityFeed",
      model: "userFeed", // use the same case as in your model definition
      populate: {
        path: "user",
        model: "User",
        select:
          "username profile.firstName profile.lastName profile.profileImgPath",
        // select:
        //   "username profile.firstName profile.lastName profile.profileImgPath",
      },
    })
    .then((community) => {
      res.status(200).json(community);
    })
    .catch((error) => {
      res.status(400).json({
        error: error.toString(),
      });
    });
};

//CREATE community
exports.createCommunity = (req, res) => {
  console.log("this is req.file ", req.file);
  let image = req.files && req.files.image ? req.files.image[0].path : null;
  console.log("this is image ", image);
  const { name, description, member, communityFeed, createdBy, moderator } =
    req.body;
  console.log("this is moderator ", moderator);
  Community.create({
    name,
    description,
    image,
    member,
    communityFeed,
    createdBy,
    moderator,
  })
    .then((newCommunity) => {
      console.log("this is newCommmunity ", newCommunity);
      res.status(201).json({
        message: "Community created successfully!",
        community: newCommunity,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
};

//UPDATE community by ID
exports.updateCommunity = (req, res) => {
  const image = req.files && req.files.image ? req.files.image[0].path : null;
  console.log("this is image ", image);

  Community.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      image: image,
    },
    { new: true }
  )
    .then((community) => {
      res.status(201).json({
        message: "Community updated successfully!",
        community: community,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
};

//Delete Community By Id
exports.deleteCommunity = (req, res) => {
  Community.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Community deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//Add member to community specific community id
exports.addMember = (req, res) => {
  Community.findById(req.params.id)
    .then((community) => {
      if (community.member.includes(req.body.member)) {
        res.status(400).json({
          message: "Member already exists!",
        });
      } else {
        return Community.findByIdAndUpdate(
          req.params.id,
          {
            $push: { member: req.body.member },
          },
          { new: true }
        );
      }
    })
    .then((community) => {
      if (community) {
        return User.findByIdAndUpdate(
          req.body.member,
          {
            $push: { communities: req.params.id },
          },
          { new: true }
        );
      }
    })
    .then((user) => {
      if (user) {
        res.status(201).json({
          message: "Member added successfully!",
          user: user,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
};

//Delete member from community specific community id
exports.deleteMember = (req, res) => {
  console.log("this is req.params.member_id ", req.params.member_id);
  console.log("this is req.params.id ", req.params.id);
  Community.findById(req.params.id)
    .then((community) => {
      if (community.member.includes(req.params.member_id)) {
        return Community.findByIdAndUpdate(
          req.params.id,
          {
            $pull: { member: req.params.member_id },
          },
          { new: true }
        );
      } else {
        res.status(400).json({
          message: "Member does not exist!",
        });
      }
    })
    .then((community) => {
      if (community) {
        return User.findByIdAndUpdate(
          req.params.member_id,
          {
            $pull: { communities: req.params.id },
          },
          { new: true }
        );
      }
    })
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "Member deleted successfully!",
          user: user,
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//Get communityFeed from community specific community id
exports.getCommunityFeed = (req, res) => {
  Community.findById(req.params.id)
    .populate("communityFeed.user")
    .then((community) => {
      res.status(200).json(community.communityFeed);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//Add post to community specific community id
exports.addPost = (req, res) => {
  let image = req.files && req.files.image ? req.files.image[0].path : null;
  const newPost = new UserFeed({
    user: req.body.user,
    content: req.body.content,
    title: req.body.title,
    multimediaContent: image,
    postType: "community",
  });
  newPost
    .save()
    .then((post) => {
      return Community.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            communityFeed: post._id,
          },
        },
        { new: true }
      ).then((community) => {
        res.status(201).json({
          message: "Post added successfully!",
          community: community,
        });
      });
    })

    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });

};

//Update post to community specific community id
exports.updatePost = (req, res) => {
  Community.updateOne(
    { _id: req.params.id, "communityFeed._id": req.params.post_id },
    {
      $set: {
        "communityFeed.$.content": req.body.content,
      },
    }
  )
    .then(() => {
      res.status(200).json({
        message: "Post updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//Delete post to the community specific community id
exports.deletePost = (req, res) => {
  Community.updateOne(
    { _id: req.params.id },
    { $pull: { communityFeed: req.params.post_id } }
  )
    .then(() => {
      res.status(200).json({
        message: "Post deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
//Add comment to post specific community id
exports.addComment = (req, res) => {
  Community.findByIdAndUpdate(req.params.id, {
    $push: { communityFeed: { comment: req.body.comment } },
  })
    .then((community) => {
      res.status(201).json({
        message: "Comment added successfully!",
        community: community,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
};

//Delete comment from post specific community id
exports.deleteComment = (req, res) => {
  Community.updateOne(
    { _id: req.params.id, "communityFeed._id": req.params.post_id },
    { $pull: { "communityFeed.$.comment": { _id: req.params.comment_id } } }
  )
    .then(() => {
      res.status(200).json({
        message: "Comment deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
