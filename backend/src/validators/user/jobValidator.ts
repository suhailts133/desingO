import Joi from "joi";
import type { ICreateJobRequest, IJobRequest, IRoomMeasurement } from "../../interfaces/customer/ICustomer.js";


const roomMeasurementValidation: Joi.ObjectSchema<IRoomMeasurement> = Joi.object<IRoomMeasurement>({
    spaceType: Joi.string()
        .required()
        .messages({
            "object.base": "Space type is required",
            "any.required": "Space type is required",
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
    ceilingHeight: Joi.string()
        .trim()
        .allow("")
        .optional(),
    unit: Joi.string()
        .required()
        .messages({
            "object.base": "Unit is required",
            "any.required": "Unit is required",
        }),
    notes: Joi.string()
        .trim()
        .pattern(/^[A-Za-z\s.,!?'-]*$/)
        .allow("")
        .optional()
        .messages({
            "string.pattern.base": "Notes must contain only letters and punctuation",
        }),
});

export const jobRequestValidation: Joi.ObjectSchema<ICreateJobRequest> = Joi.object<ICreateJobRequest>({
    projectTitle: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Project title is required",
            "string.min": "Project title must be at least 3 characters",
            "string.max": "Project title must not exceed 100 characters",
            "any.required": "Project title is required",
        }),

    propertyType: Joi.string()
        .required()
        .messages({
            "object.base": "Property type is required",
            "any.required": "Property type is required",
        }),

    description: Joi.string()
        .trim()
        .min(20)
        .max(1000)
        .required()
        .messages({
            "string.empty": "Description is required",
            "string.min": "Description must be at least 20 characters",
            "string.max": "Description must not exceed 1000 characters",
            "any.required": "Description is required",
        }),

    designStyles: Joi.array()
        .items(Joi.string())
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one design style",
            "array.base": "Design styles must be an array",
            "any.required": "Design styles are required",
        }),
    state: Joi.string()
        .required()
        .messages({
            "string.empty": "State is required",
            "any.required": "State is required",
        }),

    city: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
            "string.empty": "City is required",
            "string.min": "City must be at least 2 characters",
            "string.max": "City must not exceed 50 characters",
            "string.pattern.base": "City must contain only letters",
            "any.required": "City is required",
        }),

    district: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
            "string.empty": "District is required",
            "string.min": "District must be at least 2 characters",
            "string.max": "District must not exceed 50 characters",
            "string.pattern.base": "District must contain only letters",
            "any.required": "District is required",
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Enter a valid 10-digit Indian mobile number",
            "any.required": "Phone number is required",
        }),

    timeline: Joi.string()
        .required()
        .messages({
            "object.base": "Timeline is required",
            "any.required": "Timeline is required",
        }),

    budget: Joi.string()
        .trim()
        .pattern(/^\d+(\.\d{1,2})?$/)
        .required()
        .messages({
            "string.empty": "Budget is required",
            "string.pattern.base": "Enter a valid positive budget amount",
            "any.required": "Budget is required",
        }),

    rooms: Joi.array()
        .items(roomMeasurementValidation)
        .min(1)
        .required()
        .messages({
            "array.min": "Add at least one room with measurements",
            "array.base": "Rooms must be an array",
            "any.required": "At least one room is required",
        }),
});



