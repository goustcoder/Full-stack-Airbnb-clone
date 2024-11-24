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

router.route("/signup").get(signupFrom).post(signup);

router
  .route("/login")
  .get(loginFrom)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  );

router.get("/logout", logout);

module.exports = router;
