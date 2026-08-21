// validations/proposalValidation.ts
import Joi from "joi"
import type { ServiceItemDTO, UpdateProposalDTO } from "../features/proposal/proposalInterface"

export const serviceItemValidation = Joi.object<ServiceItemDTO>({
    serviceName: Joi.string().required().messages({
        "any.required": "Service name is required",
    }),
    order: Joi.number().integer().positive().required(),
    price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required",
    }),
    executionPrice: Joi.number().min(0).required().messages({
        "number.base": "Execution price must be a number",
        "number.min": "Execution price cannot be negative",
        "any.required": "Execution price is required",
    }),
    expectedDeliveryDate: Joi.date().greater("now").required().messages({
        "date.base": "Expected delivery date must be a valid date",
        "date.greater": "Expected delivery date must be in the future",
        "any.required": "Expected delivery date is required",
    }),
})

export const updateProposalValidation: Joi.ObjectSchema<UpdateProposalDTO> = Joi.object<UpdateProposalDTO>({
    proposalId: Joi.string().required().messages({
        "any.required": "Proposal ID is required",
    }),
    sourceId: Joi.string().required().messages({
        "any.required": "Source ID is required",
    }),
    siteVisitingNeeded: Joi.boolean().required().messages({
        "boolean.base": "Site visiting needed must be a boolean",
        "any.required": "Site visiting status is required",
    }),
    expectedSiteVisitingDate: Joi.date()
        .greater("now")
        .when("siteVisitingNeeded", {
            is: true,
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        })
        .messages({
            "date.base": "Site visiting date must be a valid date",
            "date.greater": "Site visiting date must be in the future",
            "any.required": "Site visiting date is required when site visit is enabled",
            "any.unknown": "Site visiting date is not allowed when site visit is disabled",
        }),
    drawingFeePerSqFt: Joi.number().positive().required().messages({
        "number.base": "Drawing fee must be a number",
        "number.positive": "Drawing fee must be positive",
        "any.required": "Drawing fee is required",
    }),
    expectedCompletionDate: Joi.date().greater("now").required().messages({
        "date.base": "Expected completion date is required",
        "date.greater": "Expected completion date must be in the future",
        "any.required": "Expected completion date is required",
    }),
    services: Joi.array().items(serviceItemValidation).min(1).required().messages({
        "array.min": "At least one service is required",
        "any.required": "Services are required",
    }),
})