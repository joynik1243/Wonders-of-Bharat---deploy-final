const Joi = require("joi");

module.exports.tourSpotSchema= Joi.object({
            title: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
    })

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})