import Joi from "joi";
import type { DisputeFormDTO } from "../features/proposal/proposalInterface";
import { imageValidation } from "../helpers/imageValidation";
import type { DisputeSolutionDTO } from "../features/admin/disputes/adminDisputeInterface";

export const disputeRaiseBodyValidation: Joi.ObjectSchema<DisputeFormDTO> = Joi.object<DisputeFormDTO>({
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
    type: Joi.object({
        value: Joi.string().required(),
        label: Joi.string().required(),
    })
        .required()
        .messages({
            "object.base": "Type is required",
            "any.required": "Type is required",
        }),

    evidence: Joi.array()
        .min(1)
        .items(Joi.object({ file: imageValidation("evidence") })),

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