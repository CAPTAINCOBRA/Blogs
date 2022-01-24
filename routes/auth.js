const { check, body } = require("express-validator");
const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  isSignedIn,

  createSession,
} = require("../controllers/auth");
const User = require("../models/user");

router.post(
  "/signup",
  [
    check("name", "name should be atleast 3 characters!").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password should be atleast 3 char!").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password should be atleast 3 char!").isLength({
      min: 3,
    }),
  ],
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  // res.send("protected route!");
  console.log(req.profile);
  res.json(req.auth);
});

//Handling Frontend routes

router.get("/checkSignin", (req, res) => {
  res.render("auth/signin", { user: new User() });
});

router.get("/checkSignup", (req, res) => {
  res.render("auth/signup", { user: new User() });
});

module.exports = router;
