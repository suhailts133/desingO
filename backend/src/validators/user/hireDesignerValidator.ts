import Joi from "joi";
import type { HireDesignerPayload } from "../../interfaces/customer/ICustomer";
import { roomMeasurementValidation } from "./jobValidator";
import { JobApplicationsQueryFilter } from "../designers/jobApplicationValidations";
import type { AcceptOrRejectHireDesigner, HireDesignerFilter } from "../../DTO/user/hireDesignerDTO";

export const directHireValidation = roomMeasurementValidation
    .fork(
        ['spaceType'],
        (schema) => schema.strip().optional()
    )
    .append({
        services: Joi.array()
            .items(Joi.string())
            .required()
            .messages({
                "array.base": "Services must be an array",
                "any.required": "Services is required",
            }),
        timeLine: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Timeline is required",
                "any.required": "Timeline is required",
            }),
    }) as Joi.ObjectSchema<HireDesignerPayload>


export const directHireQueryFilters = JobApplicationsQueryFilter.fork(
    ["status"],
    (schema) => schema.strip().optional()
) as Joi.ObjectSchema<HireDesignerFilter>




export const directHireApprovalOrRejectionValidation: Joi.ObjectSchema<AcceptOrRejectHireDesigner> = Joi.object<AcceptOrRejectHireDesigner>({
    status: Joi.string()
        .valid("Accepted", "Rejected")
        .required()
        .messages({
            "any.required": "Status is required",
            "any.only": "Status must be either Accepted or Rejected"
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
            "any.unknown": "Rejection reason is not allowed when status is Accepted"
        }),
    requestId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid job ID format.",
            "string.empty": "Hire Request ID is required.",
            "any.required": "Hire Request ID is required."
        })
});

