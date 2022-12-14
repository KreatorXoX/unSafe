const express = require("express");
const multer = require("multer");

const { storage } = require("../cloudinary/index");
const places = require("../controllers/places");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  validatePlace,
  isCreator,
} = require("../middlewares/middlewares");

const upload = multer({ storage: storage });

const router = express.Router();

router
  .route("/")
  .get(catchAsync(places.listPlaces))
  .post(
    isLoggedIn,
    upload.array("image"),
    validatePlace,
    catchAsync(places.createNewPlace)
  );

router.get("/new", isLoggedIn, places.newPlaceForm);

router
  .route("/:id")
  .get(catchAsync(places.showPlace))
  .put(
    isLoggedIn,
    isCreator,
    upload.array("image"),
    catchAsync(places.updatePlace)
  )
  .delete(isLoggedIn, isCreator, catchAsync(places.deletePlace));

router.get(
  "/:id/edit",
  isLoggedIn,
  isCreator,
  catchAsync(places.editPlaceForm)
);

module.exports = router;
