const express = require("express");
const passport = require("passport");

const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const {} = require("../validationSchemas");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;

      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);

      req.login(registeredUser, function (error) {
        if (error) return next(error);
        req.flash("success", "Welcome To Your Safe Place");
        res.redirect("/places");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back");

    if (req.redirect) {
      res.redirect(req.redirect);
    } else {
      res.redirect("/places");
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    req.flash("success", "Logged out!");
    res.redirect("/places");
  });
});

module.exports = router;
