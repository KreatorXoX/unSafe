const Place = require("../models/place");

module.exports.listPlaces = async (req, res) => {
  const allPlaces = await Place.find({});
  res.render("places/index", { allPlaces });
};

module.exports.newPlaceForm = (req, res) => {
  res.render("places/new");
};

module.exports.showPlace = async (req, res) => {
  const { id } = req.params;
  const foundPlace = await Place.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "creator",
      },
    })
    .populate("creator");

  if (!foundPlace) {
    req.flash("error", "No place found with the given ID");
    return res.redirect("/places");
  }

  res.render("places/show", { foundPlace });
};

module.exports.editPlaceForm = async (req, res) => {
  const { id } = req.params;
  const placeToEdit = await Place.findById(id);

  if (!placeToEdit) {
    req.flash("error", "No place found with the given ID");
    return res.redirect("/places");
  }

  res.render("places/edit", { placeToEdit });
};

module.exports.createNewPlace = async (req, res) => {
  const place = req.body.place;

  const newPlace = new Place(place);
  newPlace.creator = req.user._id;
  await newPlace.save();

  req.flash("success", "Created a new place");
  res.redirect(`/places/${newPlace._id}`);
};

module.exports.updatePlace = async (req, res) => {
  const { id } = req.params;
  const place = req.body.place;

  await Place.findByIdAndUpdate(id, place);
  req.flash("success", "Updated the place");
  res.redirect(`/places/${id}`);
};

module.exports.deletePlace = async (req, res) => {
  const { id } = req.params;

  await Place.findByIdAndRemove(id);
  req.flash("success", "Deleted the place");
  res.redirect(`/places`);
};
