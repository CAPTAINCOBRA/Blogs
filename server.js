const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const blogRouter = require("./routes/blogs");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const commentsRouter = require("./routes/comments");
const Blog = require("./models/blog");
const methodOverride = require("method-override");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser"); //Bug 1
const { log } = require("winston");
const {
  isSignedIn,
  userset,
  printRequest,
  checkStatus,
} = require("./controllers/auth");
const bodyParser = require("body-parser");
const logger = require("./myLogger");
// const myLogger = require("./myLogger");
// const logger = myLogger();

const session = require("express-session");
const flash = require("connect-flash");

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.set("view engine", "ejs");
app.use(express.json()); //Bug 1
app.use(express.urlencoded({ extended: true })); //parses urlencoded bodies
app.use(methodOverride("_method"));
app.use(cors()); //Bug 1
app.use(cookieParser()); //Bug 1
// app.use(bodyParser.json());
app.use(express.static(__dirname + "/public")); //Bug 1
app.set("views", __dirname + "/views");

console.log(__dirname);

app.use(
  session({
    secret: "flashblog",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());

app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});

//To get all blogs on main page
app.get("/", checkStatus, printRequest, isSignedIn, async (req, res) => {
  logger.info("LOG: Main page");
  const blogs = await Blog.find().sort({ createdAt: "desc" });

  var user = JSON.parse(
    decodeURIComponent(req.cookies.user) //Using cookie parser now
  );

  res.render("blogs/index", {
    blogs: blogs,
    user: user.user,
    token: req.cookies.token,
  });
  // res.render("blogs/index", { blogs: blogs });
});

app.use("/blogs", blogRouter);
app.use("/user", userRouter); //Bug 1
app.use("/auth", authRouter); //Bug 1
app.use("/comments", commentsRouter); //Bug 1

// Redirecting to Sign in on trying to create a blog without logged in

app.listen(process.env.PORT || 5000);
