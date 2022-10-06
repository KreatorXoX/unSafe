const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: String,
  image: String,
  dangerLevel: Number,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

placeSchema.post("findOneAndRemove", async function (data) {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

module.exports = mongoose.model("Place", placeSchema);
