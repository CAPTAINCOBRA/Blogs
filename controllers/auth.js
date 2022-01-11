const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

// const fetch = require("node-fetch");
const axios = require("axios");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  // console.log("errors are logged here ", errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  // console.log("The value of user is: ", user);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in Database",
      });
    }
    // res.json({
    //   name: user.name,
    //   lastname: user.lastname,
    //   email: user.email,
    //   id: user._id,
    // });
    return res.redirect("/auth/checkSignin");
  });
};

exports.signin = (req, res) => {
  console.log("Reached the signin server");
  const { email, password } = req.body;
  console.log(req.body);
  console.log(email);
  console.log(password);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User email does not exist!",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password don't match",
      });
    }

    // When rendering on the server, no access to browser
    // console.log(typeof window);
    // if (typeof window !== "undefined") {
    //   localStorage.setItem(
    //     "jwt",
    //     JSON.stringify({ token, user: { _id, name, email, role } })
    //   );
    //   console.log("we are running on the client");
    // } else {
    //   console.log("we are running on the server");
    // }

    //

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    // add user to local storage to keep user logged in between page refreshes

    // //Another temp cookie
    // res.cookie(
    //   "jwt",
    //   JSON.stringify({ token, user: { _id, name, email, role } }),
    //   { expire: new Date() + 9999 }
    // );
    // //Temp cookie ends here

    // return res.json({ token, user: { _id, name, email, role } });
    // return res.render("blogs/index");
    // console.log(res.json({ token, user: { _id, name, email, role } }));
    return res.redirect("/");
    // return res.json({
    //   token,
    //   user: { _id, name, email, role },
    //   redirect_path: "/",
    // });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");

  // res.json({
  //   message: "User Signout Successful!",
  // });
  res.redirect("/auth/checkSignin");
};

//Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
  requestProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not admin, Access Denied",
    });
  }
  next();
};

//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */
//**********************************DOES NOT WORK******************************************************88 */

exports.authenticateFrontEnd = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data)); //Here a token is being set, the jwt token if the user is successfully signed in. To know if the user is signed in or not
    next();
  }
};

exports.isAuthenticatedFrontEnd = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    //The token is set using authenticate method when onSubmit method of signin uses authenticate for returned data
    return JSON.parse(localStorage.getItem("jwt")); //We are returning whatever that jwt value is. In the frontend, we'll again check if the token matches and only then return true
  } else {
    return false;
  }
};

//http://localhost:5000/
exports.createSession = (req, res) => {
  // const { user } = req.body;
  const { email, password } = req.body;
  console.log("1 = create Session", req.body);
  // console.log("User from create Session", user);
  // return this.signinLol(JSON.stringify(user))
  // return
  const response = this.signinLol(email, password);
  // .then((response) => {
  //
  console.log("THE RESPONSE IS _ ", response);
  const data = response;
  if (data.error) {
    console.log("Error Encountered while creatingSession");
    return response.json();
  } else {
    authenticateFrontEnd(data, () => {
      console.log("Set the jwt token inside Browser's local Storage");
    });
  }

  //
  return response.json();
  // })
  // .catch((err) =>
  //   console.log("Error encountered while creating session!", err)
  // );
};

exports.signinLol = (email, password) => {
  // console.log("User from Signin LOL", user);
  // const { email, password } = user;
  console.log(email);
  console.log(password);
  // const errors = validationResult(user);

  // if (!errors.isEmpty()) {
  //   return res.status(422).json({
  //     error: errors.array()[0].msg,
  //   });
  // }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User email does not exist!",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password don't match",
      });
    }

    //
    console.log("User found");
    //

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    var res = {};
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;

    console.log("Lol - ", token);

    return res.json({ token, user: { _id, name, email, role } });
    // return res.render("blogs/index");
    // console.log(res.json({ token, user: { _id, name, email, role } }));
    // return res.redirect("/");
  });
};
