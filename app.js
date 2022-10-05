const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const Place = require("./models/place");

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/places",
  catchAsync(async (req, res) => {
    const allPlaces = await Place.find({});
    res.render("places/index", { allPlaces });
  })
);

app.get("/places/new", (req, res) => {
  res.render("places/new");
});

app.get(
  "/places/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundPlace = await Place.findById(id);
    res.render("places/show", { foundPlace });
  })
);

app.get(
  "/places/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const placeToEdit = await Place.findById(id);

    res.render("places/edit", { placeToEdit });
  })
);

app.post(
  "/places",
  catchAsync(async (req, res) => {
    const place = req.body.place;

    const newPlace = new Place(place);
    await newPlace.save();
    res.redirect(`/places/${newPlace._id}`);
  })
);

app.put(
  "/places/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const place = req.body.place;
    await Place.findByIdAndUpdate(id, place);
    res.redirect(`/places/${id}`);
  })
);
app.delete(
  "/places/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndRemove(id);
    res.redirect(`/places`);
  })
);

//handling errors occured in routes.
app.use((err, req, res, next) => {
  res.send("ohh boi");
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
