import Joi from "joi";
import type { AddDesignRequestDTO, EditDesign } from "../../DTO/designer/designDTO.js";


export const designValidation: Joi.ObjectSchema<AddDesignRequestDTO> = Joi.object<AddDesignRequestDTO>({
    name: Joi.string()
        .min(3)
        .required()
        .messages(
            { "string.empty": "Name is required" }
        ),
    description: Joi.string()
        .min(20)
        .required()
        .messages(
            { "string.min": "Description is too short" }
        ),
    designStyles: Joi.array()
        .min(1).
        required()
        .messages(
            { "array.min": "Select at least one style" }
        ),

    services: Joi.array()
        .min(1)
        .required()
        .messages(
            { "array.min": "Select at least one service" }
        ),
    spaceType: Joi.string()
        .required()
        .messages(
            { "string.empty": "Room type is required" }
        ),
    propertyType: Joi.string()
        .required()
        .messages(
            { "string.empty": "Room type is required" }
        ),

    minPrice: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Minimum budget is required",
            "number.positive": "Minimum budget must be a positive number",
            "any.required": "Minimum budget is required",
        }),

    maxPrice: Joi.number()
        .positive()
        .precision(2)
        .greater(Joi.ref("minPrice"))
        .required()
        .messages({
            "number.base": "Maximum budget is required",
            "number.positive": "Maximum budget must be a positive number",
            "number.greater": "Maximum budget must be greater than minimum budget",
            "any.required": "Maximum budget is required",
        }),

    length: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Length is required",
            "any.required": "Length is required",
        }),
    width: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Width is required",
            "any.required": "Width is required",
        }),

    unit: Joi.string()
        .required()
        .messages({
            "object.base": "Unit is required",
            "any.required": "Unit is required",
        }),

});



export const editDesignValidation: Joi.ObjectSchema<EditDesign> = Joi.object<EditDesign>({
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
        .items(Joi.string())
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one style",
            "any.required": "Design styles is required",
            "array.base": "Design styles is required",
        }),

    services: Joi.array()
        .items(Joi.string())
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one service",
            "any.required": "Services is required",
            "array.base": "Services is required",
        }),

    spaceType: Joi.string()
        .required()
        .messages({
            "string.empty": "Space type is required",
            "any.required": "Space type is required",
        }),

    propertyType: Joi.string()
        .required()
        .messages({
            "string.empty": "Property type is required",
            "any.required": "Property type is required",
        }),

    startingPrice: Joi.number()
        .required()
        .messages({
            "number.base": "Starting price must be a number",
            "any.required": "Starting price is required",
        }),

    keptGallery: Joi.array()
        .items(
            Joi.object({
                path: Joi.string().required(),
                filename: Joi.string().required(),
            })
        )
        .optional()
        .default([])
        .messages({
            "array.base": "keptGallery must be an array",
        }),
});