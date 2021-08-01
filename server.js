const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("./routes/blogs");
const userRouter = require("./routes/users");
const Blog = require("./models/blog");
const methodOverride = require("method-override");
const app = express();
const cors = require("cors");
require("dotenv").config();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); //parses urlencoded bodies
app.use(methodOverride("_method"));
app.use(cors());

//To get all blogs on main page
app.get("/", async (req, res) => {
  // res.send("Welcome!");
  const blogs = await Blog.find().sort({ createdAt: "desc" });
  res.render("blogs/index", { blogs: blogs });
});

app.use("/blogs", blogRouter);
// app.use('/user', userRouter);  //Bug 1

app.listen(5000);

// [
//   {
//     title: "Test Blog",
//     createAt: Date.now(),
//     description: "Test Description",
//   },
// ];
