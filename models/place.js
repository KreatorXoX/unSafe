const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: String,
  image: [{ url: String, key: String }],
  dangerLevel: Number,
  description: String,
  location: String,
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

// removing dependent documents just like its stated in the docs.
placeSchema.post("findOneAndRemove", async function (data) {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

module.exports = mongoose.model("Place", placeSchema);
