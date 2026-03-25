import Joi from "joi";

export const registerDataValidator = Joi.object({
    full_name: Joi.string()
        .min(3)
        .max(50)
        .trim()
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            "string.empty": "Full name is required",
            "string.min": "Full name must be at least 3 characters",
            "string.max": "Full name must be less than 50 characters",
            "string.pattern.base": "Full name must contain only letters and spaces"
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format"
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.pattern.base":
                "Password must contain uppercase, lowercase, number and special character"
        })
});


export const otpValidator = Joi.object({
    otp: Joi.string()
        .min(6)
        .max(6)
        .required()
        .messages({
            "string.empty": "OTP is required",
            "string.min": "OTP must be 6 characters",
            "string.max": "OTP must be 6 characters",
        }),


    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format"
        }),
})



export const emailValidator = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format"
        })
})



export const emailAndPasswordValidator = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .trim()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format"
        }),
    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.pattern.base":
                "Password must contain uppercase, lowercase, number and special character"
        })
})