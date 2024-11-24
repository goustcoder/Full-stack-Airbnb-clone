// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate"); // Template engine for enhancing EJS
const ExpressError = require("./utils/ExpressError.js"); // Custom error handling utility
const listing = require("./routes/listings.js"); // Routes for listings
const review = require("./routes/review.js"); // Routes for reviews
const userRoute = require("./routes/userRoute.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();
const port = 8080;

// ======= Configuration ======= //

// Set up EJS with ejs-mate for better layouts
app.engine("ejs", engine);
app.set("view engine", "ejs"); // Set view engine to EJS
app.set("views", path.join(__dirname, "views")); // Define the path for views directory

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware for overriding HTTP methods (PUT/DELETE) using query parameter `_method`
app.use(methodOverride("_method"));

// Middleware to serve static files (like CSS, JS, images) from the `public` directory
app.use(express.static(path.join(__dirname, "public")));

// ======= Database Connection ======= //
// Connect to MongoDB database `wanderlust`
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  console.log("Connected to MongoDB");
}
main().catch((err) => console.log(err));

//=== session options ==== //
const sessionOptions = {
  secret: "jeet",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

//====== session middleware ===== ///
app.use(session(sessionOptions));
//=== flash declear === //
app.use(flash());

//to use passport we need first the session is created
app.use(passport.initialize()); // first step is to initialize passport
app.use(passport.session()); //implement the session inside passport
passport.use(new LocalStrategy(User.authenticate())); //now using the local sign up inside passprt
passport.serializeUser(User.serializeUser()); //// use static serialize and deserialize of model for passport session support
passport.deserializeUser(User.deserializeUser());
//serializeUser() Generates a function that is used by Passport to serialize users into the session
//deserializeUser() Generates a function that is used by Passport to deserialize users into the session
//serializeUser() means user related info stroed in sessions

//middleware for flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ======= Routes ======= //

// Routes for handling listings (e.g., `/listing`)
app.use("/listing", listing);

// Nested routes for handling reviews under a specific listing (e.g., `/listing/:id/reviews`)
app.use("/listing/:id/reviews", review);
//nested router for login and singup
app.use("/", userRoute);

// //demo user route
// app.get('/register',async(req,res)=>{
//   let fakeUser = new User({
//     email:"jeet22761@gmail.com",
//     username:"Jeet-123",
//   })
//   let NewUser = await User.register(fakeUser,"mypassword");
//   res.send(NewUser);
// })

// ======= Server Start ======= //
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

// ======= Error Handling ======= //

// Catch-all route for handling undefined paths
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "404! Page Not Found!")); // Pass error to the custom error handler
});

// Error handling middleware for rendering error pages
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err; // Default error details
  res.status(statusCode).render("error.ejs", { message }); // Render the error page with the message
});

/**
 * Key Points:
 * 1. Express is set up with EJS for rendering views and method-override for supporting PUT/DELETE requests.
 * 2. MongoDB is connected using Mongoose, and the database name is `wanderlust`.
 * 3. Routes are modularized into `listings` and `reviews` for better organization.
 * 4. Middleware is used for parsing data, serving static files, and overriding HTTP methods.
 * 5. Errors are handled gracefully with a custom `ExpressError` utility and an error rendering middleware.
 */
