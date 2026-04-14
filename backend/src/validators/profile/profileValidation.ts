import Joi from "joi";
import type { DesignerUpdateResponseDTO, UserProfileUpdateDTO } from "../../DTO/profile/profileDTO.js";

export const designerProfileUpdateValidation: Joi.ObjectSchema<DesignerUpdateResponseDTO> = Joi.object<DesignerUpdateResponseDTO>({
    full_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "Full name is required",
            "string.empty": "Full name cannot be empty",
            "string.min": "Full name must be at least 2 characters",
            "string.max": "Full name must be at most 50 characters"
        }),

    bio: Joi.string()
        .min(10)
        .max(300)
        .required()
        .messages({
            "any.required": "Bio is required",
            "string.empty": "Bio cannot be empty",
            "string.min": "Bio must be at least 10 characters",
            "string.max": "Bio must be at most 300 characters"
        }),
    portfolioUrl: Joi.string()
        .uri()
        .required()
        .messages({
            "string.empty": "Portfolio URL is required",
            "string.uri": "Portfolio URL must be a valid URL"
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "any.required": "Phone number is required",
            "string.empty": "Phone number cannot be empty",
            "string.pattern.base": "Phone number must be a valid 10-digit number"
        }),

    state: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "State is required",
            "string.empty": "State cannot be empty",
            "string.min": "State must be at least 2 characters",
            "string.max": "State must be at most 50 characters"
        }),

    city: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "City is required",
            "string.empty": "City cannot be empty",
            "string.min": "City must be at least 2 characters",
            "string.max": "City must be at most 50 characters"
        }),

    district: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "District is required",
            "string.empty": "District cannot be empty",
            "string.min": "District must be at least 2 characters",
            "string.max": "District must be at most 50 characters"
        }),
});

export const userProfileUpdateValidation: Joi.ObjectSchema<UserProfileUpdateDTO> = Joi.object<UserProfileUpdateDTO>({

    full_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "Full name is required",
            "string.empty": "Full name cannot be empty",
            "string.min": "Full name must be at least 2 characters",
            "string.max": "Full name must be at most 50 characters"
        })
});