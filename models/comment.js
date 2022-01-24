const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const User = require("./user");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      // required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: ObjectId,
      ref: "User",
    },
    blogId: {
      type: ObjectId,
      ref: "Blog",
    },
    comments: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
    name: {
      type: String,
      required: true,
      maxLength: 32,
    },
    //   user: {
    //     type: Object,
    //     ref: "User",
    //   },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
