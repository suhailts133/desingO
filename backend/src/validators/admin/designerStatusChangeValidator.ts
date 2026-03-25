import Joi from "joi";


export const designerStatusChangeValidator = Joi.object({
    rejectionReason: Joi.string()
        .allow("")
        .optional()
        .messages({
     
            "string.base": "rejectionReason must be a string",
        }),

    status: Joi.string()
        .valid("Approved", "Rejected")
        .required()
        .messages({
            "any.only": "Invalid status selected",
            "any.required": "status is required",
        }),

})