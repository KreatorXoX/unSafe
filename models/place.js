const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  title: String,
  image: String,
  dangerLevel: Number,
  description: String,
  location: String,
});

module.exports = mongoose.model("Place", PlaceSchema);
