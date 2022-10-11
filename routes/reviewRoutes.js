const express = require("express");

// const Place = require("../models/place");
// const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const {
  validateReview,
  isLoggedIn,
  isReviewCreator,
} = require("../middlewares/middlewares");
const catchAsync = require("../utils/catchAsync");

// mergeParams is need here because our place id is in the app.js
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(reviews.createNewReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewCreator,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
