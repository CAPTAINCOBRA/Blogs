//Bug 1
const express = require("express");
const {
  signup,
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/auth");
const {
  getUserById,
  getUser,
  getAllUsers,
  updateUser,
  userBlogsList,
} = require("../controllers/user");
const User = require("../models/user");
const router = express.Router();

router.param("userId", getUserById);

// router.get("/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/:userId", isSignedIn, getUser);
router.put("/:userId", isSignedIn, isAuthenticated, updateUser);

router.put("/allBlogs/:userId", isSignedIn, isAuthenticated, userBlogsList);

router.get("/all/users", getAllUsers);

module.exports = router;
