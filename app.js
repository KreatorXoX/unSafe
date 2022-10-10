const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const PlaceRoutes = require("./routes/placeRoutes");
const ReviewRoutes = require("./routes/reviewRoutes");
const UserRoutes = require("./routes/userRoutes");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // for making sense of the passed data from forms.
app.use(methodOverride("_method")); // ejs forms only makes post and get req. so we need to override them.
app.use(express.static(path.join(__dirname, "public"))); //serving static folder.

const sessionOptions = {
  secret: "secretForSession",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires in a week.
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to use flash messages in every route.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  req.redirect = req.session.redirectTo;
  next();
});

// routes
app.use("/", UserRoutes);
app.use("/places", PlaceRoutes);
app.use("/places/:id/reviews", ReviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// for the unknown routes
app.all("*", (req, res, next) => {
  return next(new ExpressError("Page not Found", 404));
});

// handling errors occured in routes.
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "Unknown Error Occured";
  }
  res.status(status).render("error", { err });
});

try {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7xrkj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("db connected");
      app.listen(process.env.PORT || 5000, () => {
        console.log("started listening on port 5000");
      });
    });
} catch (error) {
  console.log(error);
}
