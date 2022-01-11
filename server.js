const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const blogRouter = require("./routes/blogs");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const Blog = require("./models/blog");
const methodOverride = require("method-override");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser"); //Bug 1
const { log } = require("winston");
// const bodyParser = require("body-parser");

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
console.log(__dirname);

//To get all blogs on main page
app.get("/", async (req, res) => {
  // res.send("Welcome!");
  const blogs = await Blog.find().sort({ createdAt: "desc" });
  //Jan 2022 Bug
  // console.log("req.cookies.token", req.cookies.token);
  // if (!req.cookies.token) {
  //   res.redirect("/auth/checkSignin");
  //   // log("Hello");
  //   //   //if it exists, set the auth header to the token
  //   // app.use(function (req, res, next) { //TODO:
  //   //   req.headers.authorization = "Bearer " + req.cookies.token;
  //   //   next();
  //   // });
  // } else {
  res.render("blogs/index", { blogs: blogs });
  // }
  // if (
  //   localStorage.getItem("token") == null ||
  //   localStorage.getItem("token") == undefined
  // ) {
  //   res.redirect("/checkSignin");
  // }
  // Jan 2022 Bug ends
  // res.render("blogs/index", { blogs: blogs });
});

app.use("/blogs", blogRouter);
app.use("/user", userRouter); //Bug 1
app.use("/auth", authRouter); //Bug 1

// Redirecting to Sign in on trying to create a blog without logged in
// app.use(function (err, req, res, next) {
//   if (401 == err.status) {
//     res.redirect("/auth/checkSignin");
//   }
// });

app.listen(5000);

// [
//   {
//     title: "Test Blog",
//     createAt: Date.now(),
//     description: "Test Description",
//   },
// ];
