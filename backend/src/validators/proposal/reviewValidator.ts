import Joi from 'joi';
import type { ReviewPayload } from '../../DTO/proposal/review.js';


export const reviewValidation: Joi.ObjectSchema<ReviewPayload> = Joi.object<ReviewPayload>({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': 'Please select a star rating',
            'number.min': 'Rating must be at least 1 star',
            'number.max': 'Rating cannot exceed 5 stars',
            'any.required': 'A star rating is required',
        }),
    comment: Joi.string()
        .min(10)
        .max(500)
        .required()
        .messages({
            'string.empty': 'Review comment is required',
            'string.min': 'Review must be at least 10 characters',
            'string.max': 'Review cannot exceed 500 characters',
            'any.required': 'Review comment is required',
        }),
    sourceId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid source ID format.",
            "string.empty": "source ID is required.",
            "any.required": "source ID is required."
        })
});