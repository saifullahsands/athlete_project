const joi=require("joi")

const athleteDetails=joi.object({
    'emailAddress':joi.string().email().required()
    .messages({
        "any.required":"email Address is required",
        "string.email":"email address must be a valid"
    }),
    'first_name':joi.string().min(2).required()
    .message({
        'any.required':"first name is required",
        'string.min':"first name must be at least 2 character"
    }),
    'last_name':joi.string().optional(),
    "DOB":joi.date().required()
    .messages({
        'any.required':"date of birth is required",
        'date.base':"date must be a valid date"
    })
})