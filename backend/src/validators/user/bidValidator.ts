import Joi from "joi";
import type { IBid } from "../../interfaces/customer/ICustomer";

export const bidValidation: Joi.ObjectSchema<IBid> = Joi.object<IBid>({
    timeLine: Joi.string()
        .required()
        .messages({
            "string.empty": "Timeline is required",
            "any.required": "Timeline is required",
        }),
    description: Joi.string()
        .trim()
        .min(20)
        .max(1000)
        .required()
        .messages({
            "string.empty": "Description is required",
            "string.min": "Description must be at least 20 characters",
            "string.max": "Description must not exceed 1000 characters",
            "any.required": "Description is required",
        }),
    amount: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Budget must be a number",
            "number.positive": "Budget must be positive",
            "any.required": "Budget is required",
        }),

})
