const e = require("express");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // for generating token
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const crypto = require('crypto');


//passport middleware

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      console.log("profile >> ", profile);
      console.log("accessToken >> ", accessToken);
      try {
        let user;
        user = await User.findOne({ email: profile.emails[0].value });
        console.log("user >>>", user);
        if (user) {
          done(null, user);
        } else {
          let newUser = new User({
            email: profile.emails[0].value,
            username: profile.displayName,
            profile: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              location: "N/A",
              specialty: "N/A",
            },
          });
          await newUser.save();
          done(null, newUser);
        }
      } catch (error) {
        console.error("error", error);
        done(error, null);
      }
    },
  ),
);

exports.googleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );
};

exports.googleLoginCallback = async (req, res, next) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  console.log("token", token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    const email = payload["email"];
    let user = await User.findOne({ email: email });
    if (user) {
      let token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretion",
        { expiresIn: "1h" },
      );
      res.status(200).json({
        message: "Login successful",
        token: token,
        userId: user.id,
        isNewUser: false,
      });
    } else {
      let newUser = new User({
        email: email,
        username: email,
        password: crypto.randomBytes(20).toString("hex"), //random password
        profile: {
          firstName: "N/A",
          lastName: "N/A",
          location: "N/A",
          specialty: "N/A",
        },
      });
      await newUser.save();
      let token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        "secretion",
        { expiresIn: "1h" },
      );
      res.status(200).json({
        message: "Login successful",
        token: token,
        userId: newUser.id,
        isNewUser: true,
      });
    }
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

    let emailVerificationToken = jwt.sign(
      {
        email,
      },
      "secretion",
      {
        expiresIn: "1h",
      },
    );

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
      emailVerification: {
        token: emailVerificationToken,
        expires: Date.now() + 3600000,
        verified: false,
      },
    });

    let token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "secretion",
      { expiresIn: "1h" },
    );
    console.log("the token is create", token);

    await newUser.save();

    //create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    //send mail with defined transport object
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      html: `<h1>Email Verification</h1>
      <p>Please verify your email by clicking on the following link:</p>
      <a href="http://localhost:4000/auth/verify-email/${emailVerificationToken}">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
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
            { expiresIn: "1h" },
          );
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (isValidPassword) {
          const emailToken = user.emailVerification
            ? user.emailVerification.token
            : null;

          res.status(200).json({
            message: "Login successful",
            token: token,
            userId: user.id,
            // emailToken: user.emailVerification.token,
            emailToken: emailToken,
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

//forgot password
exports.resetPassword = (req, res) => {
  const newPassword = req.body.password;
  const id = req.params.id;
  // const email = req.body.email;

  if (!newPassword || !id) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  User.findById(id)
    .then(async (user) => {
      if (user) {
        let hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password updated" });
      } else {
        res.status(400).json({ error: "Invalid email" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });

  //create reusable transporter object using the default SMTP transport
};

//if not match, return error
exports.logout = (req, res) => {
  console.log(req.body);
  res.send("logout");
};

//verify email
exports.verifyEmail = async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  } else {
    try {
      const user = await User.findOne({
        "emailVerification.token": token,
        "emailVerification.expires": { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      user.emailVerification.verified = true;
      await user.save();

      res.status(200).json({ message: "Email verified" });
      // .redirect("http://localhost:3000/login");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

//SEND RESET PASSWORD EMAIL
exports.sendResetPasswordEmail = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  User.findOne({ email: email }).then(async (user) => {
    if (user) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Password",
        html: `<h1>Reset Password</h1>
        <p>Please reset your password by clicking on the following link:</p>
        <a href="http://localhost:3000/reset-password/${user.id}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>`,
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).json({ message: "Email sent" });
    } else {
      res.status(400).json({ error: "Invalid email" });
    }
  });
};

//send email verification
exports.sendEmailVerification = async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: req.params.email,
    subject: "Email Verification",
    html: `<h1>Email Verification</h1>
    <p>Please verify your email by clicking on the following link:</p>
    <a href="http://localhost:3000/verify-email/${req.params.token}">Verify Email</a>
    <p>If you did not request this, please ignore this email.</p>`,
  };
};

// Verify email
