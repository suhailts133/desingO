import Joi from 'joi';
import type { ReviewPayloadFields } from '../features/proposal/proposalInterface';


export const reviewValidation:Joi.ObjectSchema<ReviewPayloadFields> = Joi.object<ReviewPayloadFields>({
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
});