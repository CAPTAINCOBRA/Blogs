const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const Blog = require("../models/blog");

const logger = require("../myLogger");
// const myLogger = require("../myLogger");
// const logger = myLogger();

const axios = require("axios");

exports.signup = (req, res) => {
  logger.info("LOG: Signup Controller");
  const errors = validationResult(req);
  // console.log("errors are logged here ", errors);
  if (!errors.isEmpty()) {
    // return res.status(422).json({
    //   error: errors.array()[0].msg,
    // });
    req.flash("message", errors.array()[0].msg);
    return res.redirect("/auth/checkSignup");
  }

  const user = new User(req.body);
  // console.log("The value of user is: ", user);
  user.save((err, user) => {
    if (err) {
      // return res.status(400).json({
      //   err: "Not able to save user in Database",
      // });
      logger.error("LOG: Not able to save user in Database");
      req.flash("message", "Not able to save user in Database");
      return res.redirect("/auth/checkSignup");
    }

    req.flash("success", "Sign up successfull!");
    return res.redirect("/auth/checkSignin");
  });
};

exports.signin = (req, res) => {
  logger.info("LOG: Signin Controller");
  console.log("Reached the signin server");
  const { email, password } = req.body;
  console.log(req.body);
  console.log(email);
  console.log(password);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // return res.status(422).json({
    //   error: errors.array()[0].msg,
    // });
    req.flash("message", errors.array()[0].msg);
    return res.redirect("/auth/checkSignin");
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      // return res.status(400).json({
      //   error: "User email does not exist!",
      // });
      logger.error("LOG: User email does not exist!" + user);
      req.flash("message", "User Email does not exist!");
      return res.redirect("/auth/checkSignin");
    }
    logger.error("LOG: User email does  exist!");

    if (!user.authenticate(password)) {
      // return res.status(401).json({
      //   error: "Email and Password don't match",
      // });
      req.flash("message", "Email and Password don't match!");
      return res.redirect("/auth/checkSignin");
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;

    res.cookie("user", JSON.stringify({ user: { _id, name, email, role } }), {
      expire: new Date() + 9999,
    });

    // req.profile = user;
    req.flash("message", "Signed in successfully!");
    // logger.info("EKAN: - " + req.flash("message", "Welcome to Blog"));
    res.redirect("/");
  });
};

exports.signout = (req, res) => {
  logger.info("LOG: Signout Controller");
  res.clearCookie("token");
  res.clearCookie("user");

  res.redirect("/auth/checkSignin");
};

exports.printRequest = (req, res, next) => {
  logger.info("LOG: PrintRequest Middleware");
  // logger.log({
  //   level: "info",
  //   message: req,
  // });
  console.log("Cookies: ", req.cookies.token);
  logger.log({
    level: "info",
    message: JSON.parse(decodeURIComponent(req.cookies.user)),
  });

  next();
};

//Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
  requestProperty: "auth",
  getToken: (req) => {
    logger.info("LOG: Extracting token from Request");
    if (req.headers["cookie"]) {
      const token = req.cookies.token;

      return token;
    }
    console.log("No token found");
    return null;
  },
});

exports.isAuthenticated = (req, res, next) => {
  logger.info("LOG: isAuthenticated Middleware");
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  logger.info("LOG: isAdmin Middleware");
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not admin, Access Denied",
    });
  }
  next();
};

exports.checkStatus = (req, res, next) => {
  logger.info("LOG: checkStatus Middleware");
  // if (req.headers["cookie"]) {
  if (req.cookies.token) {
    next();
  } else {
    res.redirect("/auth/checkSignin");
  }
};
