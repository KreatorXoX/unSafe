const Place = require("../models/place");
const Review = require("../models/review");
const { validPlaceSchema } = require("../utils/validationSchemas");
const { validReviewSchema } = require("../utils/validationSchemas");
const ExpressError = require("../utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.validatePlace = (req, res, next) => {
  const result = validPlaceSchema.validate(req.body);

  if (result.error) {
    const allErrorMessages = result.error.details
      .map((err) => err.message)
      .join(", ");
    req.flash("error", "allErrorMessages.");
    throw new ExpressError(allErrorMessages, 500);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const result = validReviewSchema.validate(req.body);
  if (result.error) {
    const allErrorMessages = result.error.details
      .map((err) => err.message)
      .join(", ");
    req.flash("error", "allErrorMessages.");
    throw new ExpressError(allErrorMessages, 500);
  } else {
    next();
  }
};

module.exports.isCreator = async (req, res, next) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  const creator = req.user._id;

  if (place && !place.creator.equals(creator)) {
    req.flash("error", "You are not allowed to this operation.");
    res.redirect(`/places/${id}`);
    // throw new ExpressError("You are not allowed to this operaion", 403);
  } else {
    next();
  }
};

// we getting id for place and reviewId for review
module.exports.isReviewCreator = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  const creatorId = review.creator;
  const userId = req.user._id;

  if (review && !creatorId.equals(userId)) {
    req.flash("error", "You are not allowed to this operation.");
    res.redirect(`/places/${id}`);
    // throw new ExpressError("You are not allowed to this operaion", 403);
  } else {
    next();
  }
};
