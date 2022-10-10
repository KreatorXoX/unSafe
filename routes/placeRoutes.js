const express = require("express");
const {
  isLoggedIn,
  validatePlace,
  isCreator,
} = require("../middlewares/middlewares");
const Place = require("../models/place");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const allPlaces = await Place.find({});
    res.render("places/index", { allPlaces });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("places/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundPlace = await Place.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "creator",
        },
      })
      .populate("creator");

    if (!foundPlace) {
      req.flash("error", "No place found with the given ID");
      return res.redirect("/places");
    }

    res.render("places/show", { foundPlace });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isCreator,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const placeToEdit = await Place.findById(id);

    if (!placeToEdit) {
      req.flash("error", "No place found with the given ID");
      return res.redirect("/places");
    }

    res.render("places/edit", { placeToEdit });
  })
);

router.post(
  "/",
  isLoggedIn,
  validatePlace,
  catchAsync(async (req, res) => {
    const place = req.body.place;

    const newPlace = new Place(place);
    newPlace.creator = req.user._id;
    await newPlace.save();

    req.flash("success", "Created a new place");
    res.redirect(`/places/${newPlace._id}`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isCreator,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const place = req.body.place;

    await Place.findByIdAndUpdate(id, place);
    req.flash("success", "Updated the place");
    res.redirect(`/places/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isCreator,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await Place.findByIdAndRemove(id);
    req.flash("success", "Deleted the place");
    res.redirect(`/places`);
  })
);

module.exports = router;
