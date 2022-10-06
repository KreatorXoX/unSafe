const express = require("express");

const Place = require("../models/place");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { validReviewSchema } = require("../validationSchemas");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const result = validReviewSchema.validate(req.body);
  if (result.error) {
    const allErrorMessages = result.error.details
      .map((err) => err.message)
      .join(", ");

    throw new ExpressError(allErrorMessages, 500);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const place = await Place.findById(id);
    const review = new Review(req.body.review);
    place.reviews.push(review);
    await review.save();
    await place.save();

    res.redirect(`/places/${id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);

    res.redirect(`/places/${id}`);
  })
);

module.exports = router;
