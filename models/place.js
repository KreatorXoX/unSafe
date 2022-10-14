const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  key: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const options = { toJSON: { virtuals: true } };
const placeSchema = new Schema(
  {
    title: String,
    image: [imageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: { type: [Number], required: true },
    },
    dangerLevel: Number,
    description: String,
    location: String,
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  options
);

placeSchema.virtual("properties").get(function () {
  return {
    title: `<a href="/places/${this._id}">${this.title}</a>`,
    danger: this.dangerLevel,
  };
});

// removing dependent documents just like its stated in the docs.
placeSchema.post("findOneAndRemove", async function (data) {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

module.exports = mongoose.model("Place", placeSchema);
