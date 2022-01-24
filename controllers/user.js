const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../myLogger");

exports.getUserById = (req, res, next, id) => {
  logger.info("LOG: getUserById Middleware");
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB for this id",
      });
    }
    req.profile = user;
    console.log(req.profile);
    next();
  });
};

exports.getUser = async (req, res) => {
  logger.info("LOG: getUser Controller");
  var userIdI = req.params.userId;
  console.log("The userId is - ", userIdI);
  //TODO: get back here for password
  // return res.json(req.profile);
  // var user = JSON.parse(
  //   decodeURIComponent(req.cookies.user) //Using cookie parser now
  // );
  // const blogs = await Blog.find().sort({ createdAt: "desc" });
  // all blogs of the user
  //req.profile will contain the blogger profile user
  // decode and json parse of reqcookies will contain the visitor user
  logger.info("EKAN:" + req.profile._id);
  logger.info("EKAN:" + req.cookies);
  var visitor = JSON.parse(decodeURIComponent(req.cookies.user));
  // const blogs = await Blog.find({ userId: req.profile._id });
  const blogs = await Blog.find({ userId: req.profile._id }).sort({
    createdAt: "desc",
  });
  // logger.info(blogs);
  // logger.log({
  //   level: "info",
  //   message: blogs,
  // });
  logger.info("EKAN:" + req.profile);
  // res.render("user/profile", { user: req.profile, blogs: req.profile.blogs });
  res.render("user/profile", {
    user: req.profile,
    blogs: blogs,
    visitor: visitor.user,
  });
};

exports.updateUser = (req, res) => {
  logger.info("LOG: updateUser Controller");
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "You are not authorized to update this user!",
        });
      }
      res.json(user);
    }
  );
};

exports.userBlogsList = (req, res) => {
  logger.info("LOG: userBlogsList Controller");
  //We find user by reference of the model Blog
  Blog.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, blog) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this account",
        });
      }
      return res.json(blog);
    });

  //anytime we are referencing something in a different collection, we use populate.
  //In populatre, we put the model we want to update and the fields we want to bring in.
};

exports.getAllUsers = (req, res) => {
  logger.info("LOG: getAllUsers Controller");
  User.find((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    // console.log(err);
    return res.status(200).json(users);
  });
};
