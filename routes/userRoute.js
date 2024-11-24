const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  signup,
  signupFrom,
  loginFrom,
  login,
  logout,
} = require("../controller/userController.js");

// Signup Routes
router.get("/signup", signupFrom);

router.post("/signup", signup);

// Login Routes
router.get("/login", loginFrom);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

router.get("/logout", logout);

module.exports = router;
