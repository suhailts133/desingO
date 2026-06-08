import Joi from "joi";
import type { CreateProposalDTO } from "../../DTO/proposal/proposal.js";

const serviceItemSchema = Joi.object({
    serviceName: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Service name is required",
            "any.required": "Service name is required",
        }),

    order: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "Order must be a number",
            "number.integer": "Order must be an integer",
            "number.min": "Order must be at least 1",
            "any.required": "Order is required",
        }),

    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.positive": "Price must be a positive number",
            "any.required": "Price is required",
        }),

    executionPrice: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Execution price must be a number",
            "number.positive": "Execution price must be a positive number",
            "any.required": "Execution price is required",
        }),

    expectedDeliveryDate: Joi.date()
        .greater("now")
        .required()
        .messages({
            "date.base": "Expected delivery date must be a valid date",
            "date.greater": "Expected delivery date must be in the future",
            "any.required": "Expected delivery date is required",
        }),

    actualDeliveryDate: Joi.date()
        .optional()
        .messages({
            "date.base": "Actual delivery date must be a valid date",
        }),
});

export const createProposalValidation: Joi.ObjectSchema<CreateProposalDTO> = Joi.object<CreateProposalDTO>({
    sourceId: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Source ID is required",
            "any.required": "Source ID is required",
        }),

    sourceType: Joi.string()
        .valid("jobRequest", "directHire")
        .required()
        .messages({
            "any.only": 'Source type must be either "jobRequest" or "directHire"',
            "any.required": "Source type is required",
        }),

    drawingFeePerSqFt: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Drawing fee per sq/ft must be a number",
            "number.positive": "Drawing fee per sq/ft must be a positive number",
            "any.required": "Drawing fee per sq/ft is required",
        }),

    expectedCompletionDate: Joi.date()
        .greater("now")
        .required()
        .messages({
            "date.base": "Expected completion date must be a valid date",
            "date.greater": "Expected completion date must be in the future",
            "any.required": "Expected completion date is required",
        }),

    services: Joi.array()
        .items(serviceItemSchema)
        .min(1)
        .required()
        .messages({
            "array.base": "Services must be an array",
            "array.min": "At least one service is required",
            "any.required": "Services are required",
        }),
});