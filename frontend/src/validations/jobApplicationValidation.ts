import Joi from "joi";
import type { JobApplicationRejection } from "../features/user/jobApplications/jobApplicationInterFace";

export const JobApplicationRejectionValidation:Joi.ObjectSchema<JobApplicationRejection> = Joi.object<JobApplicationRejection>({
   rejectionReason: Joi.string()
          .min(15)
          .max(400)
          .trim()
          .required()
          .messages({
              "string.base": "reason must be a string",
              "string.empty": "reason cannot be empty",
              "string.min": "reason should have at least 15 characters",
              "string.max": "reason should not exceed 400 characters"
          })
})
