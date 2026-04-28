import Joi from "joi";
import type { EditDesignFields, IDesign } from "../features/designer/designs/designInterface";

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


export const designValidation: Joi.ObjectSchema<IDesign> = Joi.object<IDesign>({
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "any.required": "Name is required"
        }),

    description: Joi.string()
        .min(20)
        .required()
        .messages({
            "string.empty": "Description is required",       
            "string.min": "Description is too short",
            "any.required": "Description is required"
        }),

    designStyles: Joi.array()
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one style",
            "any.required": "Design styles is required",    
            "array.base": "Design styles is required"
        }),

    services: Joi.array()
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one service",
            "any.required": "Services is required",         
            "array.base": "Services is required"
        }),

    spaceType: Joi.object({
        value: Joi.string().required(),
        label: Joi.string().required(),
    })
        .required()
        .messages({
            "object.base": "Space type is required",
            "any.required": "Space type is required",
        }),

    propertyType: Joi.object({
        value: Joi.string().required(),
        label: Joi.string().required(),
    })
        .required()
        .messages({
            "object.base": "Property type is required",
            "any.required": "Property type is required",
        }),

    startingPrice: Joi.number()
        .required()
        .messages({
            "number.base": "Starting price must be a number",  
            "any.required": "Starting price is required"
        }),

    coverImage: imageValidation("Cover image"),

    gallery: Joi.array()
        .min(1)
        .items(Joi.object({ file: imageValidation("Gallery image") })),
});



export const editDesignValidation:Joi.ObjectSchema<EditDesignFields> = Joi.object<EditDesignFields>({
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "any.required": "Name is required",
        }),
 
    description: Joi.string()
        .min(20)
        .required()
        .messages({
            "string.empty": "Description is required",
            "string.min": "Description is too short",
            "any.required": "Description is required",
        }),
 
    designStyles: Joi.array()
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one style",
            "any.required": "Design styles is required",
            "array.base": "Design styles is required",
        }),
 
    services: Joi.array()
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one service",
            "any.required": "Services is required",
            "array.base": "Services is required",
        }),
 
    spaceType: Joi.object({
        value: Joi.string().required(),
        label: Joi.string().required(),
    })
        .required()
        .messages({
            "object.base": "Space type is required",
            "any.required": "Space type is required",
        }),
 
    propertyType: Joi.object({
        value: Joi.string().required(),
        label: Joi.string().required(),
    })
        .required()
        .messages({
            "object.base": "Property type is required",
            "any.required": "Property type is required",
        }),
 
    startingPrice: Joi.number()
        .required()
        .messages({
            "number.base": "Starting price must be a number",
            "any.required": "Starting price is required",
        }),
});