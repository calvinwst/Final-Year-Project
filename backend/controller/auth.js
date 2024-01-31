const e = require("express");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // for generating token
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//passport middleware

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "783635155300-np7klph0dsta6h9k0trmo5f4gp7sdli4.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "http://www.example.com/auth/google/callback",
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       user.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );

// Sign up new user
exports.register = async (req, res) => {
  try {
    let password = req.body.password;
    const { email, username, firstName, lastName, specialty, location } =
      req.body;

    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      profile: {
        firstName,
        lastName,
        specialty,
        location,
      },
    });

    let token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "secretion",
      { expiresIn: "1h" }
    );
    console.log("the token is create", token);

    await newUser.save();

    res
      .status(200)
      .json({
        message: "Registration successful",
        token: token,
        userId: newUser.id,
      });
  } catch (error) {
    console.error(error);
    console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    User.findOne({ email: email }).then(async (user) => {
      if (user) {
        let isValidPassword = false;

        try {
          isValidPassword = await bcrypt.compare(password, user.password);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        let token;
        try {
          token = jwt.sign(
            { userId: user.id, email: user.email },
            "secretion",
            { expiresIn: "1h" }
          );
          
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (isValidPassword) {
          res.status(200).json({
            message: "Login successful",
            token: token,
            userId: user.id,
          });
          console.log("Login successful");
        } else {
          res.status(400).json({ error: "Invalid email or password" });
        }
      } else {
        res.status(400).json({ error: "Invalid email or password" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//if not match, return error

exports.logout = (req, res) => {
  console.log(req.body);
  res.send("logout");
};
