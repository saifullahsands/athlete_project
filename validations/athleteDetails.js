const joi = require("joi");

const currentYear = new Date().getFullYear();
const athletevalidateSchema = joi.object({
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
    ft: joi.number().positive().precision(2).required().messages({
      "any.required": "ft is required",
      "number.base": "ft must be a number",
      "number.positive": "ft number must be a positive",
    }),
    inches: joi.number().positive().precision(2).required().messages({
      "any.required": "inches is required",
      "number.base": "inches must be a number",
      "number.positive": "inches number must be a positive",
    }),
    weight: joi.number().positive().precision(2).required().messages({
      "any.required": "weight is required",
      "number.base": "weight must be a number",
      "number.positive": "weight number must be a positive",
    }),
    school_name: joi.string().required().trim().messages({
      "any.required": "school name is required",
    }),
    GPA: joi.number().positive().precision(2).required().messages({
      "any.required": "GPA is required",
      "number.base": "GPA must be a number",
      "number.positive": "GPA number must be a positive",
    }),

    graduated_year: joi.date().required().messages({
      "any.required": "graduated year is required",
      "date.base": "graduated year must be a valid date",
    }),
    about: joi.string().required().trim().messages({
      "any.required": "about is required",
    }),
    currentTeam: joi.string().optional(),
    coachName: joi.string().optional(),

    achievements: joi
      .array()
      .items(
        joi.object({
          name: joi.string().required(),
          year: joi
            .number()
            .integer()
            .max(currentYear)
            .min(1910)
            .optional()
            .messages({
              "number.base": " achievment year must be a number",
              "number.integer": "achievment year must be a whole number",
              "number.min": "achievment year must be after 1910",
              "number.max": `achievment cannot b greater than ${currentYear}`,
            }),
        })
      )
      .optional(),
    sportData: joi
      .array()
      .items(
        joi.object({
          sportId: joi.number().integer().positive().required().messages({
            "any.required": "sportId is required",
            "number.base": "sportId must be a number",
          }),
          position: joi.string().min(2).required().messages({
            "any.required": "position is required",
            "string.min": "position must be at least 2 characters",
          }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "at least one sport must be selected",
        "any.required": "sportData is required",
      }),
  }),
});

module.exports = athletevalidateSchema;
