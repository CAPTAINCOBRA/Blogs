const express = require("express");
const {
  isSignedIn,
  isAuthenticated,
  printRequest,
} = require("../controllers/auth");
const router = express.Router();
const Blog = require("../models/blog");

const User = require("../models/user");
const Comment = require("../models/comment");

const logger = require("../myLogger");

//create a new comment on a given blogId from a given userId and save it to the database
router.post("/:blogId/comments", isSignedIn, async (req, res) => {
  logger.info("LOG: Create a New Comment Controller");
  const blog = await Blog.findById(req.params.blogId);
  const user = JSON.parse(decodeURIComponent(req.cookies.user)); //visitor
  //   console.log("Req.body is EKAN:", req.body);
  const comment = {
    text: req.body.comment,
    name: user.user.name,
    // avatar: user.user.avatar,
    userId: user.user._id,
    blogId: blog._id,
  };
  const commentdb = await Comment.create(comment);
  blog.comments.push(commentdb._id);
  await blog.save();
  const userdb = await User.findById(user.user._id);
  //   console.log("EKAN:" + userdb);
  userdb.comments.push(commentdb._id);
  await userdb.save();
  res.redirect(`/blogs/${blog.slug}`);
});

//Delete a comment if written by the logged in user and redirect to the blog page with the comment removed from the database and the user's comment array in the database
router.delete("/:blogId/comments/:commentId", isSignedIn, async (req, res) => {
  logger.info("LOG: Delete a Comment Controller");
  const blog = await Blog.findById(req.params.blogId);
  const user = JSON.parse(decodeURIComponent(req.cookies.user));
  const comment = await Comment.findById(req.params.commentId);
  console.log("Comment is ", comment);
  if (comment.userId.toString() === user.user._id.toString()) {
    comment.remove();
    blog.comments.pull(comment._id);
    await blog.save();
    const userdb = await User.findById(user.user._id);
    userdb.comments.pull(comment._id);
    await userdb.save();
  }
  res.redirect(`/blogs/${blog.slug}`);
});

//return a comment to READ
router.get("/:slug/comment/:commentId", async (req, res) => {
  logger.info("LOG: Open a Blog to Read Controller");
  const user = JSON.parse(decodeURIComponent(req.cookies.user));

  const blog = await Blog.findOne({ slug: req.params.slug });
  if (blog == null) res.redirect("/");

  blog.comments.find((comment) => {
    if (comment._id.toString() === req.params.commentId) {
      //   res.render("blogs/show", { blog: blog, user: user.user });
      return res.json(comment);
    }
  });
});

function saveBlogAndRedirect(path) {
  logger.info("LOG: SavingAndRedirecting a Blog Function");
  return async (req, res) => {
    var user = JSON.parse(decodeURIComponent(req.cookies.user));
    logger.log({
      level: "error",
      message: user.email,
    });
    let blog = req.blog;
    blog.title = req.body.title;
    blog.description = req.body.description;
    blog.markdown = req.body.markdown;
    blog.userId = user.user._id;
    // blog.user = user.user;
    // blog.user = {user.user.blogs=[], ...user.user}
    //Add the user to the blog's user field without the blogs array
    blog.user = { ...user.user, blogs: [] };

    //Add this blog to user's blogs array in the database
    await User.findByIdAndUpdate(
      req.auth._id,
      {
        $push: { blogs: blog },
      },
      (usefindAndModify = false)
    );

    try {
      blog = await blog.save();
      res.redirect(`/blogs/${blog.slug}`); //Issue was Detected here. Since the blogs was not preceded by '/' here, it added this path to our string instead of taking us to it. So I got messages like - Cannot PUT /blogs/edit/blogs/610556a438c9fe07444e4036 || Cannot GET /blogs/edit/blogs/second-blog
    } catch (e) {
      console.log("Error is ", e);
      res.render(`blogs/${path}`, { blog: blog });
    }
  };
}

module.exports = router;
