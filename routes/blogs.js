const express = require("express");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const router = express.Router();
const Blog = require("../models/blog");

//Open a new Blog page. On submit, we'll create a new blog and be redirected
router.get("/new", isSignedIn, isAuthenticated, async (req, res) => {
  // if (err.name === "UnauthorizedError") {
  //   res.redirect("/auth/checkSignin");
  // }
  res.render("blogs/new", { blog: new Blog() });
});

//Open a blog to EDIT that already exist(on clicking)
router.get("/edit/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("blogs/edit", { blog: blog });
});

//Open a blog to READ
router.get("/:slug", async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (blog == null) res.redirect("/");

  res.render("blogs/show", { blog: blog });
});

//Create a new Blog
router.post(
  "/",
  async (req, res, next) => {
    req.blog = new Blog();
    next();
  },
  saveBlogAndRedirect("new")
);

// router.put(
//   "/:id",
//   async (req, res, next) => {
//     req.blog = await Blog.findById(req.params.id);
//     next();
//   },
//   saveBlogAndRedirect("edit")
// );

//Update a Blog
router.put(
  "/putta/:id",
  async (req, res, next) => {
    req.blog = await Blog.findById(req.params.id);
    next();
  },
  saveBlogAndRedirect("edit")
);

//Delete a Blog
router.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveBlogAndRedirect(path) {
  return async (req, res) => {
    let blog = req.blog;
    blog.title = req.body.title;
    blog.description = req.body.description;
    blog.markdown = req.body.markdown;
    try {
      blog = await blog.save();
      res.redirect(`/blogs/${blog.slug}`); //Issue was Detected here. Since the blogs was not preceded by '/' here, it added this path to our string instead of taking us to it. So I got messages like - Cannot PUT /blogs/edit/blogs/610556a438c9fe07444e4036 || Cannot GET /blogs/edit/blogs/second-blog
    } catch (e) {
      console.log("Error is ", e);
      res.render(`blogs/${path}`, { blog: blog });
    }
  };
}

// router.get("/", (req, res) => {
//   res.send("<h1>In Blogs</h1>");
// });

module.exports = router;
