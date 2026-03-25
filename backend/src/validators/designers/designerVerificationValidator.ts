import Joi from "joi";

export const designerVeificationDataValidator = Joi.object({
    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Phone number must be a valid 10-digit Indian mobile number"
        }),

    state: Joi.string()
        .valid(
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
            "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
            "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
            "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
            "Jammu and Kashmir"
        )
        .required()
        .messages({
            "string.empty": "State is required",
            "any.only": "Please select a valid Indian state or union territory"
        }),

    district: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            "string.empty": "District is required",
            "string.min": "District must be at least 2 characters",
            "string.max": "District must be less than 100 characters"
        }),

    city: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            "string.empty": "City is required",
            "string.min": "City must be at least 2 characters",
            "string.max": "City must be less than 100 characters"
        }),

    governmentIdType: Joi.string()
        .valid("aadhar_card", "driving_licence")
        .required()
        .messages({
            "string.empty": "Government ID type is required",
            "any.only": "Government ID type must be either Aadhar Card or Driving Licence"
        }),


    education: Joi.array()
        .items(
            Joi.object({
                institutionName: Joi.string()
                    .min(2)
                    .max(150)
                    .trim()
                    .required()
                    .messages({
                        "string.empty": "Institution name is required",
                        "string.min": "Institution name must be at least 2 characters",
                        "string.max": "Institution name must be less than 150 characters"
                    }),

                courseName: Joi.string()
                    .min(2)
                    .max(100)
                    .trim()
                    .required()
                    .messages({
                        "string.empty": "Course name is required",
                        "string.min": "Course name must be at least 2 characters",
                        "string.max": "Course name must be less than 100 characters"
                    }),

                completionYear: Joi.number()
                    .integer()
                    .min(1970)
                    .max(new Date().getFullYear())
                    .required()
                    .messages({
                        "number.base": "Completion year must be a valid year",
                        "number.integer": "Completion year must be a whole number",
                        "number.min": "Completion year must be 1970 or later",
                        "number.max": "Completion year cannot be in the future"
                    }),

            })
        )
        .min(1)
        .max(4)
        .required()
        .messages({
            "array.base": "Education must be a list",
            "array.min": "At least one education entry is required",
            "array.max": "You can add a maximum of 4 education entries"
        }),

    workExperience: Joi.array()
        .items(
            Joi.object({
                companyName: Joi.string()
                    .min(2)
                    .max(150)
                    .trim()
                    .required()
                    .messages({
                        "string.empty": "Company name is required",
                        "string.min": "Company name must be at least 2 characters",
                        "string.max": "Company name must be less than 150 characters"
                    }),

                role: Joi.string()
                    .min(2)
                    .max(100)
                    .trim()
                    .required()
                    .messages({
                        "string.empty": "Role is required",
                        "string.min": "Role must be at least 2 characters",
                        "string.max": "Role must be less than 100 characters"
                    }),

                yearsOfExperience: Joi.number()
                    .min(1)
                    .max(10)
                    .precision(1)
                    .required()
                    .messages({
                        "number.base": "Years of experience must be a number",
                        "number.min": "Years of experience cannot be negative",
                        "number.max": "Years of experience cannot exceed 50"
                    }),
            })
        )
        .max(4)
        .optional()
        .messages({
            "array.base": "Work experience must be a list",
            "array.max": "You can add a maximum of 4 work experience entries"
        }),

    portfolioUrl: Joi.string()
        .uri()
        .required()
        .messages({
            "string.empty": "Portfolio URL is required",
            "string.uri": "Portfolio URL must be a valid URL"
        }),
    bio: Joi.string()
        .min(15)
        .max(400)
        .trim()
        .required()
        .messages({
            "string.base": "Bio must be a string",
            "string.empty": "Bio cannot be empty",
            "string.min": "Bio should have at least 15 characters",
            "string.max": "Bio should not exceed 400 characters"
        })
}) 