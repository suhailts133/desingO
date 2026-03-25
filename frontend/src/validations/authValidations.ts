import Joi from "joi";
import type { LoginPayload, ISignup, EmailPayload, IPassword } from "../features/auth/authInterfaces";

export const signupValidations: Joi.ObjectSchema<ISignup> = Joi.object<ISignup>({
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
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "string.empty": "Confirm password is required",
            "any.only": "Passwords do not match"
        })
});

export const emailValidation: Joi.ObjectSchema<EmailPayload> = Joi.object<EmailPayload>({
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



export const loginValidations: Joi.ObjectSchema<LoginPayload> = Joi.object<LoginPayload>({
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
        }),
})


export const changePasswordValidations: Joi.ObjectSchema<IPassword> = Joi.object<IPassword>({
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
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "string.empty": "Confirm password is required",
            "any.only": "Passwords do not match"
        })
});
