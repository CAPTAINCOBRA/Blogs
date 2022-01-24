// // blogs.js TODO:
// // Parsing a cookie
// // decodeURIComponent(req.headers["cookie"].split("=")[2]) //Some jwt malformed issue
// // decodeURIComponent(req.headers["cookie"].split("=")[1].split(";")[0])

// // For updating
// // router.put(
// //   "/:id",
// //   async (req, res, next) => {
// //     req.blog = await Blog.findById(req.params.id);
// //     next();
// //   },
// //   saveBlogAndRedirect("edit")
// // );

// // router.get("/", (req, res) => {
// //   res.send("<h1>In Blogs</h1>");
// // });

// var user = JSON.parse(decodeURIComponent(req.cookies.user));

// // USER CONTRIOLLER TODO:

// //middleware
// // exports.pushArticleInBlogList = (req, res, next) => {
// //   let bogs = [];
// //   req.body.order.products.forEach((product) => {
// //     purchases.push({
// //       //Creating and pushing an object here
// //       _id: product._id,
// //       name: product.name,
// //       description: product.description,
// //       category: product.category,
// //       quantity: product.quantity,
// //       amount: req.body.order.amount,
// //       transaction_id: req.body.order.transaction_id,
// //     });
// //   });

// //   //Store this in DB
// //   //Since everything is in this User
// //   //Below method parameters found in docs
// //   User.findOneAndUpdate(
// //     //We use findOneAndUpdate is used so that previous record is not over written
// //     { _id: req.profile._id },
// //     { $push: { purchases: purchases } },
// //     { new: true }, //send back the new object from db and not the old one
// //     (err, purchases) => {
// //       if (err) {
// //         return res.status(400).json({
// //           error: "Unable to purchase list",
// //         });
// //       }
// //       next();
// //     }
// //   );
// // };

// // AUTH CONTROLLERS TODO:

// // const fetch = require("node-fetch");

// // signup response
// // res.json({
// //   name: user.name,
// //   lastname: user.lastname,
// //   email: user.email,
// //   id: user._id,
// // });

// // SIGN IN METHOD

// // When rendering on the server, no access to browser
// // console.log(typeof window);
// // if (typeof window !== "undefined") {
// //   localStorage.setItem(
// //     "jwt",
// //     JSON.stringify({ token, user: { _id, name, email, role } })
// //   );
// //   console.log("we are running on the client");
// // } else {
// //   console.log("we are running on the server");
// // }

// //

// //Nit official way of sending data to the frontend
// // res.cookie("user", JSON.stringify({ _id, name, email, role }), {
// //   expire: new Date() + 9999,
// // });
// //Not official ends
// // add user to local storage to keep user logged in between page refreshes

// // return res.json({ token, user: { _id, name, email, role } });
// // return res.render("blogs/index");

// // const blogs =
// // Blog.find()
// //   .sort({ createdAt: "desc" })
// //   .then((blogs) => {
// //     // console.log("User  = " + user);
// //     res.render("blogs/index", { blogs, user, token });
// //   });

// // res.render("blogs/index", {
// //   user: { _id, name, email, role },
// //   blogs: blogs,
// // });

// // res.json({
// //   token,
// //   user: { _id, name, email, role },
// // });

// // return res.json({
// //   token,
// //   user: { _id, name, email, role },
// //   redirect_path: "/",
// // });

// // attach user to response and redirect to "/" route
// // res.setHeader("Set-Cookie", "user" + user);

// // PRINT REQUEST TODO:

// // logger.log({
// //   level: "info",
// //   message: req.headers["cookie"].split("=")[1],
// // });

// // logger.log({
// //   level: "info",
// //   message: req.profile,
// // });

// // logger.log({
// //   level: "info",
// //   message: req.auth,
// // });
// // console.log("############Request is: ", req);

// //   IS SIGNED IN?

// // var token = req.headers["cookie"].split("=")[1]; //Commented it after making delete button conditional. Some JWT malformed issue
// // var token = req.headers["cookie"].split("=")[2];m Using CookieParser Now
// // token = token.split(";")[0];

// // console.log("Just took the token = " + token);
// // console.log("token is: ", req.headers["cookie"].split("=")[2]);
// // const user = decodeURIComponent(req.headers["cookie"].split("=")[2]);
// // console.log(user);

// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */
// //**********************************DOES NOT WORK******************************************************88 */

// exports.authenticateFrontEnd = (data, next) => {
//   if (typeof window !== "undefined") {
//     localStorage.setItem("jwt", JSON.stringify(data)); //Here a token is being set, the jwt token if the user is successfully signed in. To know if the user is signed in or not
//     next();
//   }
// };

// exports.isAuthenticatedFrontEnd = () => {
//   if (typeof window == "undefined") {
//     return false;
//   }
//   if (localStorage.getItem("jwt")) {
//     //The token is set using authenticate method when onSubmit method of signin uses authenticate for returned data
//     return JSON.parse(localStorage.getItem("jwt")); //We are returning whatever that jwt value is. In the frontend, we'll again check if the token matches and only then return true
//   } else {
//     return false;
//   }
// };

// //http://localhost:5000/
// exports.createSession = (req, res) => {
//   // const { user } = req.body;
//   const { email, password } = req.body;
//   console.log("1 = create Session", req.body);
//   // console.log("User from create Session", user);
//   // return this.signinLol(JSON.stringify(user))
//   // return
//   const response = this.signinLol(email, password);
//   // .then((response) => {
//   //
//   console.log("THE RESPONSE IS _ ", response);
//   const data = response;
//   if (data.error) {
//     console.log("Error Encountered while creatingSession");
//     return response.json();
//   } else {
//     authenticateFrontEnd(data, () => {
//       console.log("Set the jwt token inside Browser's local Storage");
//     });
//   }

//   //
//   return response.json();
//   // })
//   // .catch((err) =>
//   //   console.log("Error encountered while creating session!", err)
//   // );
// };

// exports.signinLol = (email, password) => {
//   // console.log("User from Signin LOL", user);
//   // const { email, password } = user;
//   console.log(email);
//   console.log(password);
//   // const errors = validationResult(user);

//   // if (!errors.isEmpty()) {
//   //   return res.status(422).json({
//   //     error: errors.array()[0].msg,
//   //   });
//   // }

//   User.findOne({ email }, (err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         error: "User email does not exist!",
//       });
//     }

//     if (!user.authenticate(password)) {
//       return res.status(401).json({
//         error: "Email and Password don't match",
//       });
//     }

//     //
//     console.log("User found");
//     //

//     const token = jwt.sign({ _id: user._id }, process.env.SECRET);
//     var res = {};
//     res.cookie("token", token, { expire: new Date() + 9999 });

//     const { _id, name, email, role } = user;

//     console.log("Lol - ", token);

//     return res.json({ token, user: { _id, name, email, role } });
//     // return res.render("blogs/index");
//     // console.log(res.json({ token, user: { _id, name, email, role } }));
//     // return res.redirect("/");
//   });
// };

// // SERVER.JS TODO:

// // const { auth, requiresAuth } = require("express-openid-connect");
// // app.use(
// //   auth({
// //     authRequired: false,
// //     auth0Logout: true,
// //     issuerBaseURL: process.env.ISSUER_BASE_URL,
// //     baseURL: process.env.BASE_URL,
// //     clientID: process.env.CLIENT_ID,
// //     secret: process.env.SECRET,
// //     idpLogout: true,
// //   })
// // );

// AUTH.js ROUTES
// router.post("/createSession", createSession);

// SERVER.JS TODO:

//Jan 2022 Bug
// console.log("req.cookies.token", req.cookies.token);
// if (!req.cookies.token) {
//   console.log("No token");
//   res.redirect("/auth/checkSignin");
// } else {
// console.log("req.cookies.token - token present", req.cookies.token);

// console.log("USER IS", req.headers["cookie"].split("="));
// req.user = userset;
// console.log("USER IS", req.user);

// decodeURIComponent(req.headers["cookie"].split("=")[2]) //Some jwt malformed issue
// decodeURIComponent(req.headers["cookie"].split("=")[1].split(";")[0])

// console.log("user after cookie decoding = " + user.user.email);

// [
//   {
//     title: "Test Blog",
//     createAt: Date.now(),
//     description: "Test Description",
//   },
// ];

// Redirecting to Sign in on trying to create a blog without logged in
// app.use(function (err, req, res, next) {
//   if (401 == err.status) {
//     res.redirect("/auth/checkSignin");
//   }
// });
