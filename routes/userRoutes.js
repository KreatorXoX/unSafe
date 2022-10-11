const express = require("express");
const passport = require("passport");

const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router
  .route("/register")
  .get(users.registerForm)
  .post(catchAsync(users.createNewUser));

router
  .route("/login")
  .get(users.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", users.logoutUser);

module.exports = router;
