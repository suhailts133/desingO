import Joi from "joi";
import type { ProposalAcceptOrRejectDTO } from "../../DTO/proposal/proposal";

export const proposalApproveOrRejectionValidation: Joi.ObjectSchema<ProposalAcceptOrRejectDTO> = Joi.object<ProposalAcceptOrRejectDTO>({
    contractStatus: Joi.string()
        .valid("Accepted", "Rejected")
        .required()
        .messages({
            "any.required": "Status is required",
            "any.only": "Status must be either Accepted or Rejected"
        }),

    overallRejectionReason: Joi.string()
        .min(10)
        .max(40)
        .when("status", {
            is: "Rejected",
            then: Joi.required(),
            otherwise: Joi.forbidden()
        })
        .messages({
            "string.min": "Rejection reason must be at least 10 characters",
            "string.max": "Rejection reason must be at most 40 characters",
            "any.required": "Rejection reason is required when status is Rejected",
            "any.unknown": "Rejection reason is not allowed when status is Accepted"
        }),
    sourceId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid sourceId ID format.",
            "string.empty": "sourceId ID is required.",
            "any.required": "sourceId ID is required."
        })
});