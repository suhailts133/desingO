import Joi from "joi";
import type { VersionAcceptOrRejectDTO } from "../../DTO/proposal/version.js";

export const versionApproveOrRejectValidation: Joi.ObjectSchema<VersionAcceptOrRejectDTO> = Joi.object<VersionAcceptOrRejectDTO>({
    status: Joi.string()
        .valid("Approved", "Rejected")
        .required()
        .messages({
            "any.required": "Status is required",
            "any.only": "Status must be either Approved or Rejected"
        }),

    rejectionReason: Joi.string()
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
            "any.unknown": "Rejection reason is not allowed when status is Approved"
        }),
    versionId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid versionID ID format.",
            "string.empty": "version ID is required.",
            "any.required": "version ID is required."
        })
});