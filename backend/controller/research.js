const Research = require("../model/research");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.getAllResearch = (req, res) => {
  Research.find()
    .then((research) => {
      res.status(200).json(research);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllResearchById = (req, res) => {
  Research.find({ researcher: req.params.id })
    .then((research) => {
      res.status(200).json(research);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getResearchById = (req, res) => {
  Research.findOne({ _id: req.params.id })
    .populate(
      "researcher",
      "username profile.firstName profile.lastName profile.profileImgPath"
    )
    .then((research) => {
      res.status(200).json(research);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//ADDING RESEARCH
exports.createResearch = (req, res) => {
  const { title, description, tags, researcher } = req.body;
  // let researcher = req.userId; // Assuming you have user ID from authentication
  let filePath = req.files && req.files.file ? req.files.file[0].path : null;
  let imagePath = req.files && req.files.image ? req.files.image[0].path : null;
  console.log("this is the file path: ", filePath);
  console.log("this is the image path: ", imagePath);
  console.log("this si the tag: ", tags);
  // If 'tag' is a stringified array, parse it. Otherwise, use it as is.
  let parsedTags;
  try {
    parsedTags = JSON.parse(tags);
  } catch {
    parsedTags = tags;
  }

  Research.create({
    title,
    description,
    researcher,
    tags: parsedTags,
    filePath,
    imagePath,
    // file,
  })
    .then((newResearch) => {
      console.log("this the added: ", newResearch);
      res.status(201).json({
        message: "Research created successfully!",
        research: newResearch,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
};

// exports.createResearch = (req, res) => {
//   Research.create({
//     title: req.body.title,
//     description: req.body.description,
//     researcher: req.body.researcher,
//     publicationDate: req.body.publicationDate,
//     tag: req.body.tag,
//   })
//     .then((newResearch) => {
//       console.log(newResearch);
//       res.status(201).json({
//         message: "Research created successfully!",
//         research: newResearch,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(400).json({
//         error: error,
//       });
//     });
// };

exports.updateResearch = (req, res) => {
  // const { title, description, publicationDate, tag } = req.body;
  const { title, description, tags } = req.body;
  console.log("Received tags: ", tags);
  Research.findOne({ _id: req.params.id })
    .then((research) => {
      if (!research) {
        return res.status(404).json({
          message: "Research not found!",
          ƒ,
        });
      }
      if (title) research.title = title;
      if (description) research.description = description;
      if (tags) research.tags = tags;

      return research.save();
    })
    .then((updateResearch) => {
      res.status(200).json({
        message: "Research updated successfully!",
        updateResearch,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteResearch = (req, res) => {
  Research.deleteOne({ _id: req.params.id })
    .then(
      res.status(200).json({
        message: "Research deleted successfully!",
      })
    )
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
