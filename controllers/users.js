const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("auth/register");
};
module.exports.createNewUser = async (req, res) => {
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
};

module.exports.loginForm = (req, res) => {
  res.render("auth/login");
};
module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back");

  if (req.redirect) {
    res.redirect(req.redirect);
  } else {
    res.redirect("/places");
  }
};

module.exports.logoutUser = (req, res) => {
  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    req.flash("success", "Logged out!");
    res.redirect("/places");
  });
};
