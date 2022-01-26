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

  // var isLiked = false;
  if (blog.usersLiked.includes(user.user._id)) {
    blog.isLiked = true;
  } else {
    blog.isLiked = false;
  }

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

  // Removing like from user for the deleted blog
  const blogId = req.params.id;
  const blogComments = await Comment.find({ blogId: blogId });
  var usersLiked = await Blog.findById(blogId).populate("usersLiked");
  usersLiked.usersLiked.forEach((user) => {
    user.blogsLiked.pull(blogId);
    user.save();
  });
  logger.info("LOG: removed likes from users ");
  // delete all the comments that were made in this blog from users' comments array in the database and then delete the blog itself from the database itself
  blogComments.forEach(async (comment) => {
    const user = await User.findById(comment.userId);
    user.comments.pull(comment._id);
    user.save();
    comment.remove();
  });
  logger.info("LOG: removed comments from users ");

  await Blog.findByIdAndDelete(req.params.id);
  logger.info("LOG: Blog Deleted");

  //remove the blog from the user's blogs array
  await User.findByIdAndUpdate(
    req.auth._id,
    {
      $pull: { blogs: req.params.id },
    },
    (usefindAndModify = false)
  );
  logger.info("LOG: Blog removed from User's blogs array");

  // Removing the comments issue starts
  // Remove the comments associated with the blog from the user's comments array in the database (if any) and remove the blogId field from the comments (if any)
  // await User.updateMany(
  //   { comments: { $in: req.params.id } },
  //   { $pull: { comments: req.params.id } },
  //   (usefindAndModify = false)
  // );

  // logger.info("LOG: Comments removed from User's comments array");

  // Remove the comments on this blog from the database
  await Comment.deleteMany({ blogId: req.params.id });
  // Removing the comments issue ends
  logger.info("LOG: Comments deleted");

  // //Removing the likes issue starts
  // // Remove the likes associated with the blog from the user's likes array in the database (if any)
  // await User.updateMany(
  //   { blogsLiked: { $in: req.params.id } },
  //   { $pull: { blogsLiked: req.params.id } },
  //   (usefindAndModify = false)
  // );
  // //Removing the likes issue ends
  logger.info("LOG: Likes removed from User's likes array");

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

router.get("/:blogId/like_toggle", isSignedIn, async (req, res) => {
  logger.info("LOG: Like a Blog Controller");
  // res.send("Like a Blog");

  const blog = await Blog.findById(req.params.blogId);
  const user = JSON.parse(decodeURIComponent(req.cookies.user));

  if (blog.usersLiked?.includes(user.user._id)) {
    //Remove the user from the likes array
    await Blog.findByIdAndUpdate(
      req.params.blogId,
      {
        $pull: { usersLiked: user.user._id },
        $set: { likes: blog.likes - 1 },
      },
      (usefindAndModify = false)
    );
  } else {
    //Add the user to the likes array
    await Blog.findByIdAndUpdate(
      req.params.blogId,
      {
        $push: { usersLiked: user.user._id },
        $set: { likes: blog.likes + 1 },
      },
      (usefindAndModify = false)
    );
  }

  // if (blog.usersLiked?.length > 0) {
  //   await Blog.findByIdAndUpdate(
  //     req.params.blogId,
  //     {
  //       $set: { likes: blog.usersLiked.length },
  //     },
  //     (usefindAndModify = false)
  //   );
  // } else {
  //   await Blog.findByIdAndUpdate(
  //     req.params.blogId,
  //     {
  //       $set: { likes: 0 },
  //     },
  //     (usefindAndModify = false)
  //   );
  // }

  console.log("req . auth is ", req.auth);
  if (user.user.blogsLiked?.includes(req.params.blogId)) {
    await User.findByIdAndUpdate(
      req.auth._id,
      {
        $pull: { blogsLiked: req.params.blogId },
      },
      (usefindAndModify = false)
    );
  } else {
    await User.findByIdAndUpdate(
      req.auth._id,
      {
        $push: { blogsLiked: req.params.blogId },
      },
      (usefindAndModify = false)
    );
  }
  // Final response if any to be returned here. Not returning anthing here
  return res.redirect(`/blogs/${blog.slug}`);
});

// }))

module.exports = router;
