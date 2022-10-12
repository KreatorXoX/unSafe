const Joi = require("joi");

module.exports.validPlaceSchema = Joi.object({
  place: Joi.object({
    title: Joi.string().required(),
    //image: Joi.string().allow(""),
    description: Joi.string().required(),
    location: Joi.string().required(),
    dangerLevel: Joi.number().min(1).max(10).required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.validReviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});
