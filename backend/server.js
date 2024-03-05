require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const checkAuth = require("../backend/middleware/check-auth");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");
const socketController = require("./controller/socketController");

//express app
const app = express();

// Implementing socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
}); // Integrate Socket.io with the server

socketController(io); // Call the socketController function and pass the io object0

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//passport middleware
app.use(passport.initialize());

//cors
app.use(cors());

//set headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow any domain to access
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // allow these headers
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS" // allow these methods
  );
  next();
});

app.use("/uploads/pdf", express.static(path.join(__dirname, "uploads/pdf")));

app.use("uploads/pdf", (req, res, next) => {
  if (path.extname(req.path).toLowerCase() === ".pdf") {
    res.setHeader("Content-Type", "application/pdf");
  }
  next();
});

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads/images"))
);

//routers
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const userProfileRoutes = require("./routes/userProfile");
const researchRoutes = require("./routes/research");
const communityRoutes = require("./routes/community");
const userFeedRoutes = require("./routes/userFeed");
const connectionRoutes = require("./routes/connection");
const chatRoutes = require("./routes/chat");

//middleware
// app.use( communityRoutes);

app.use(checkAuth, userProfileRoutes);
app.use(checkAuth, researchRoutes);
app.use(checkAuth, communityRoutes);
app.use(checkAuth, userFeedRoutes);
app.use(checkAuth, connectionRoutes);
app.use(checkAuth, chatRoutes);

//connect to db
mongoose
  .connect(
    "mongodb+srv://wong25472:kr56ifbLI@fypdb.9rfeakd.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to db");

    server.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
