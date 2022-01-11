const Blog = require("../models/blog");
const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB for this id",
      });
    }
    req.profile = user;
    console.log(req.profile);
    next();
  });
};

exports.getUser = (req, res) => {
  var userIdI = req.params.userId;
  console.log("The userId is - ", userIdI);
  //TODO: get back here for password
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "You are not authorized to update this user!",
        });
      }
      res.json(user);
    }
  );
};

exports.userBlogsList = (req, res) => {
  //We find user by reference of the model Blog
  Blog.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, blog) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this account",
        });
      }
      return res.json(blog);
    });

  //anytime we are referencing something in a different collection, we use populate.
  //In populatre, we put the model we want to update and the fields we want to bring in.
};

//middleware
// exports.pushArticleInBlogList = (req, res, next) => {
//   let bogs = [];
//   req.body.order.products.forEach((product) => {
//     purchases.push({
//       //Creating and pushing an object here
//       _id: product._id,
//       name: product.name,
//       description: product.description,
//       category: product.category,
//       quantity: product.quantity,
//       amount: req.body.order.amount,
//       transaction_id: req.body.order.transaction_id,
//     });
//   });

//   //Store this in DB
//   //Since everything is in this User
//   //Below method parameters found in docs
//   User.findOneAndUpdate(
//     //We use findOneAndUpdate is used so that previous record is not over written
//     { _id: req.profile._id },
//     { $push: { purchases: purchases } },
//     { new: true }, //send back the new object from db and not the old one
//     (err, purchases) => {
//       if (err) {
//         return res.status(400).json({
//           error: "Unable to purchase list",
//         });
//       }
//       next();
//     }
//   );
// };

exports.getAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    // console.log(err);
    return res.status(200).json(users);
  });
};
