const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.htmlStrip": "{{#label}} must not include HTML!",
  },
  rules: {
    htmlStrip: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) {
          return helpers.error("string.htmlStrip", { value });
        }
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.validPlaceSchema = Joi.object({
  place: Joi.object({
    title: Joi.string().required().htmlStrip(),
    //image: Joi.string().allow(""),
    description: Joi.string().required().htmlStrip(),
    location: Joi.string().required().htmlStrip(),
    dangerLevel: Joi.number().min(1).max(10).required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.validReviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().htmlStrip(),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});
