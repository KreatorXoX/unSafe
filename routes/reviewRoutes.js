const express = require("express");

const Place = require("../models/place");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const {
  validateReview,
  isLoggedIn,
  isCreator,
  isReviewCreator,
} = require("../middlewares/middlewares");

// mergeParams is need here because our place id is in the app.js
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const place = await Place.findById(id);

    review.creator = req.user._id;

    const newReview = new Review(review);
    place.reviews.push(newReview);

    await newReview.save();
    await place.save();

    req.flash("success", "Created a new review");
    res.redirect(`/places/${id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewCreator,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);

    req.flash("success", "Review is deleted");
    res.redirect(`/places/${id}`);
  })
);

module.exports = router;
