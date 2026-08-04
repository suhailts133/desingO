import Joi from "joi";
import type { JobApplicationApprovalOrRejectionRequestDTO, JobApplicationFilter } from "../../DTO/designer/jobsDTO";

export const jobApplicationValidation: Joi.ObjectSchema<{ jobId: string }> = Joi.object<{ jobId: string }>({
    jobId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid job ID format.",
            "string.empty": "Job ID is required.",
            "any.required": "Job ID is required."
        })
})

export const jobApplicationApprovalOrRejectionValidation: Joi.ObjectSchema<JobApplicationApprovalOrRejectionRequestDTO> = Joi.object<JobApplicationApprovalOrRejectionRequestDTO>({
    status: Joi.string()
        .valid("Ongoing", "Rejected")
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
    jobId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid job ID format.",
            "string.empty": "Job ID is required.",
            "any.required": "Job ID is required."
        })
});



export const JobApplicationsQueryFilter: Joi.ObjectSchema<JobApplicationFilter> = Joi.object<JobApplicationFilter>({
    page: Joi.string().pattern(/^[0-9]+$/),
    status: Joi.string().valid("Pending", "Approved", "Rejected", "Ongoing"),
    sort: Joi.string().valid("asc", "desc"),
    startDate: Joi.string().isoDate(),
    endDate: Joi.string().isoDate()
})