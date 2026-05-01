import Joi from "joi";
import type { AdminDesignerVerificationFilter, AdminUserManagementFilter } from "../features/admin/users/adminUserInterface";
import type { AdminDesignerReject } from "../features/admin/designerVerification/adminDesignerVerificationInterfaces";


export const adminUserFilter: Joi.ObjectSchema<AdminUserManagementFilter> = Joi.object<AdminUserManagementFilter>({
  name: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "Name must contain only alphabets",
      "string.base": "Name must be a string",
    }),

  role: Joi.string()
    .valid("All", "Customer", "Designer")
    .required()
    .messages({
      "any.only": "Invalid role selected",
      "any.required": "Role is required",
    }),

  status: Joi.string()
    .valid("All", "Active", "Blocked")
    .required()
    .messages({
      "any.only": "Invalid status selected",
      "any.required": "Status is required",
    }),
})


export const adminDesignerReject: Joi.ObjectSchema<AdminDesignerReject> = Joi.object<AdminDesignerReject>({
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





export const adminDesignerVerificationFilter: Joi.ObjectSchema<AdminDesignerVerificationFilter> = Joi.object<AdminDesignerVerificationFilter>({
  name: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "Name must contain only alphabets",
      "string.base": "Name must be a string",
    }),


  status: Joi.string()
    .valid("All", "Pending", "Approved", "Rejected")
    .required()
    .messages({
      "any.only": "Invalid status selected",
      "any.required": "Status is required",
    }),
})
