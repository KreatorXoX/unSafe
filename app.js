const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");

const PlaceRoutes = require("./routes/placeRoutes");
const ReviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/places", PlaceRoutes);
app.use("/places/:id/reviews", ReviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

//for the unknown routes
app.all("*", (req, res, next) => {
  return next(new ExpressError("Page not Found", 404));
});

//handling errors occured in routes.
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
