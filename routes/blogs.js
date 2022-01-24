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

//Open a new Blog page. On submit, we'll create a new blog and be redirected
// router.get("/new", isSignedIn, async (req, res) => {
router.get("/new", printRequest, isSignedIn, async (req, res) => {
  logger.info("LOG: Open New Blog page Controller");
  // if (err.name === "UnauthorizedError") {
  //   res.redirect("/auth/checkSignin");
  // }
  res.render("blogs/new", { blog: new Blog() });
});

//Open a blog to EDIT that already exist(on clicking)
router.get("/edit/:id", async (req, res) => {
  logger.info("LOG: Open a Blog to Edit Controller");
  const blog = await Blog.findById(req.params.id);
  res.render("blogs/edit", { blog: blog });
});

//Open a blog to READ
router.get("/:slug", async (req, res) => {
  logger.info("LOG: Open a Blog to Read Controller");
  const user = JSON.parse(decodeURIComponent(req.cookies.user));

  const blog = await Blog.findOne({ slug: req.params.slug });
  const author = await User.findById(blog.userId);
  // console.log("Author is ", author);
  const comments = await Comment.find({ blogId: blog._id });
  if (blog == null) res.redirect("/");

  res.render("blogs/show", {
    blog: blog,
    user: user.user,
    author: author,
    comments: comments,
  });
});

//Create a new Blog
router.post(
  "/",
  isSignedIn,
  async (req, res, next) => {
    logger.info("LOG: Create(POST) a New Blog Controller");
    req.blog = new Blog();
    next();
  },
  saveBlogAndRedirect("new")
);

//Update a Blog
router.put(
  "/putta/:id",
  isSignedIn,
  async (req, res, next) => {
    logger.info("LOG: Update(PUT) a Blog Controller");
    req.blog = await Blog.findById(req.params.id);
    next();
  },
  saveBlogAndRedirect("edit")
);

//Delete a Blog
router.delete("/:id", isSignedIn, async (req, res) => {
  logger.info("LOG: Delete(DELETE) a Blog Controller");
  await Blog.findByIdAndDelete(req.params.id);

  //remove the blog from the user's blogs array
  await User.findByIdAndUpdate(
    req.auth._id,
    {
      $pull: { blogs: req.params.id },
    },
    (usefindAndModify = false)
  );

  res.redirect("/");
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
