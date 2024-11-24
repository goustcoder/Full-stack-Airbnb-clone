const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.signupFrom = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const data = await User.register(newUser, password);
    console.log(data);
    req.logIn(data, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listing");
    });
  } catch (e) {
    console.error(e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginFrom = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to wonderLust");
  //console.log(".....hello",res.locals.redirectURL)
  // console.log(req.session.redirectURL);
  let redirect_url = res.locals.redirectURL || "/listing";
  res.redirect(redirect_url);
};

module.exports.logout = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You are not logged in already");
    res.redirect("/listing");
  } else {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      req.flash("error", "You successfully Logged out");
      res.redirect("/listing");
    });
  }
};
