const Place = require("../models/place");
const Review = require("../models/review");

module.exports.createNewReview = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndRemove(reviewId);

  req.flash("success", "Review is deleted");
  res.redirect(`/places/${id}`);
};
