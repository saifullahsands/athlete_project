const joi = require("joi");

const CoachvalidateSchema = joi.object({
  query: joi.object().empty(),
  params: joi.object().empty(),
  body: joi.object({
    emailAddress: joi.string().email().required().messages({
      "any.required": "email Address is required",
      "string.email": "email address must be a valid",
    }),
    first_name: joi.string().min(2).required().messages({
      "any.required": "first name is required",
      "string.min": "first name must be at least 2 character",
    }),
    last_name: joi.string().optional(),
    DOB: joi.date().required().messages({
      "any.required": "date of birth is required",
      "date.base": "date must be a valid date",
    }),
    gender: joi.string().required().valid("FEMALE", "MALE").messages({
      "any.only": "gender must be either FEMALE or MALE",
      "any.required": "gender is required",
    }),
    address: joi.string().trim().required().max(300).messages({
      "any.required": "address is required",
      "string.max": "address must not exceed 300 characters",
    }),
    city: joi.string().required().max(100).messages({
      "any.required": "city is required",
      "string.max": "city must not exceed 100 characters",
    }),
    state: joi.string().required().max(100).messages({
      "any.required": "state is required",
      "string.max": "state must not exceed 100 characters",
    }),
    phone: joi.string().length(11).pattern(/^\d+$/).required().messages({
      "any.required": "phone number is required",
      "string.length": "phone number must be 11 digits",
      "string.pattern.base": "phone number contain only  digits",
    }),
    coaching_experience: joi
      .number()
      .required()
      .positive()
      .min(1)
      .max(50)
      .messages({
        "any.required": "experience is required",
        "number.positive": "experience is must be a positive",
        "number.min": "experience must be a 1",
        "number.max": "experience not above 50 number ",
      }),
    about: joi.string().required().trim().messages({
      "any.required": "about is required",
    }),
    work_experience: joi
      .array()
      .items(
        joi.object({
          name: joi.string().required().messages({
            "any.required": "achievments name is required",
          }),
          year: joi.number().integer().max(1).max(50).required().messages({
            "any.required": "work experience year is required",
            "number.base": "work experience year is must be a number",
            "number.min": "work experience year must be a 1",
            "number.max": "work experince year not above 50 year",
          }),
        })
      )
      .required()
      .messages({
        "any.required": "work experience is required",
      }),
    sportIds: joi
      .array()
      .items(joi.number().integer().positive())
      .min(1)
      .required(),
  }),
});

module.exports = CoachvalidateSchema;
