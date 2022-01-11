//Bug1

const mongoose = require("mongoose");
const crypto = require("crypto");
// const uuidv1 = require("uuid/v1");
// import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4 } = require("uuid");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 32,
    },
    lastname: {
      type: String,
      maxLength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userInfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    // blogs: {
    //   type: Array,
    //   default: [],

    // }
  },
  {
    timestamps: true,
  }
);

userSchema
  .virtual("password")
  .set(function (password) {
    //We expect somebody to give us this password
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
