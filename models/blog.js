const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const { JSDOM } = require("jsdom");
const createDomPurify = require("dompurify");
const dompurify = createDomPurify(new JSDOM().window);
const { ObjectId } = mongoose.Schema;

const User = require("./user");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: "User",
  },
  user: {
    type: Object,
    ref: "User",
  },
  comments: [
    {
      type: ObjectId,
      ref: "Comment",
    },
  ],
  usersLiked: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
});

blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }

  next();
});

module.exports = mongoose.model("Blog", blogSchema);
