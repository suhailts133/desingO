import Joi from "joi";
import type { DesignerProfileDTO, IProfileImage } from "../features/designer/profile/designerProfileInterface";



export const DesignerprofileUpdationValidations: Joi.ObjectSchema<DesignerProfileDTO> = Joi.object<DesignerProfileDTO>({

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
});



const imageValidation = (fieldName: string, isOptional = false) => {
    const validator = Joi.any()
        .custom((value, helpers) => {
            const file = value instanceof FileList ? value[0] : value?.[0];
            if (!file) return isOptional ? value : helpers.error("any.required");

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
            if (!allowedTypes.includes(file.type)) return helpers.error("any.invalidType");
            if (file.size > 5 * 1024 * 1024) return helpers.error("any.invalidSize");

            return value;
        })
        .messages({
            "any.required": `${fieldName} is required`,
            "any.invalidType": `${fieldName} must be a valid image (jpeg, png, webp)`,
            "any.invalidSize": `${fieldName} must be smaller than 5MB`,
        });
    return isOptional ? validator.optional() : validator.required();
};


export const profileImageValidation: Joi.ObjectSchema<IProfileImage> = Joi.object<IProfileImage>({
    profileImage: imageValidation("Cover image"),
});