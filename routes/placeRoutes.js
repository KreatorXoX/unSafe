const express = require("express");

const Place = require("../models/place");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { validPlaceSchema } = require("../validationSchemas");

const router = express.Router();

const validatePlace = (req, res, next) => {
  const result = validPlaceSchema.validate(req.body);

  if (result.error) {
    const allErrorMessages = result.error.details
      .map((err) => err.message)
      .join(", ");

    throw new ExpressError(allErrorMessages, 500);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const allPlaces = await Place.find({});
    res.render("places/index", { allPlaces });
  })
);

router.get("/new", (req, res) => {
  res.render("places/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundPlace = await Place.findById(id).populate("reviews");
    res.render("places/show", { foundPlace });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const placeToEdit = await Place.findById(id);

    res.render("places/edit", { placeToEdit });
  })
);

router.post(
  "/",
  validatePlace,
  catchAsync(async (req, res) => {
    const place = req.body.place;

    const newPlace = new Place(place);
    await newPlace.save();
    res.redirect(`/places/${newPlace._id}`);
  })
);

router.put(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const place = req.body.place;
    await Place.findByIdAndUpdate(id, place);
    res.redirect(`/places/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndRemove(id);
    res.redirect(`/places`);
  })
);

module.exports = router;
