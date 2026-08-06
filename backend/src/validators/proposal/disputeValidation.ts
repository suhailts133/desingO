import Joi from "joi";
import type { AcceptOrRejectDisputeDTO, DisputeRaiseBody, DisputeSolutionDTO } from "../../DTO/proposal/dispute";

export const disputeRaiseBodyValidation: Joi.ObjectSchema<DisputeRaiseBody> = Joi.object<DisputeRaiseBody>({
    reason: Joi.string()
        .trim()
        .min(10)
        .max(1000)
        .required()
        .messages({
            "string.empty": "Reason is required",
            "string.min": "Reason must be at least 10 characters",
            "string.max": "Reason must not exceed 1000 characters",
            "any.required": "Reason is required",
        }),
    type: Joi.string()
        .trim()

        .required()
        .messages({
            "string.empty": "Type of dispute is required",
            "any.required": "Type of dispute is required",
        }),

    sourceId: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            "string.empty": "Source ID is required",
            "string.pattern.base": "Invalid Source ID",
            "any.required": "Source ID is required",
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
});




export const acceptOrRejectDisputeValidation: Joi.ObjectSchema<AcceptOrRejectDisputeDTO> = Joi.object<AcceptOrRejectDisputeDTO>({
    status: Joi.string()
        .valid("Resolved", "Redo")
        .required()
        .messages({
            "any.only": 'Status must be either "Resolved" or "Redo"',
            "string.empty": "Status is required",
            "any.required": "Status is required",
        }),

    disputeId: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            "string.empty": "Dispute ID is required",
            "string.pattern.base": "Invalid Dispute ID",
            "any.required": "Dispute ID is required",
        }),
});




export const disputeSolutionValidation: Joi.ObjectSchema<DisputeSolutionDTO> = Joi.object<DisputeSolutionDTO>({
    disputeId: Joi.string()
        .required(),

    resolutionType: Joi.string()
        .valid("Refund", "Redo", "Warning", "Dismissed", "Full_Refund")
        .required()
        .messages({
            "any.only": "Select a valid resolution type",
            "string.empty": "Resolution type is required",
            "any.required": "Resolution type is required",
        }),

    resolution: Joi.string()
        .trim()
        .min(15)
        .max(500)
        .required()
        .messages({
            "string.empty": "Resolution details are required",
            "string.min": "Resolution should have at least 15 characters",
            "string.max": "Resolution should not exceed 500 characters",
            "any.required": "Resolution details are required",
        }),

    refundAmount: Joi.when("resolutionType", {
        is: "Refund",
        then: Joi.number()
            .min(1)
            .required()
            .messages({
                "number.base": "Refund amount must be a number",
                "number.min": "Refund amount must be greater than 0",
                "any.required": "Refund amount is required for a refund resolution",
            }),
        otherwise: Joi.number().valid(0).default(0),
    }),
});