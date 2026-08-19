import Joi from "joi";
import type { HireDesignerPayload, ICreateJobRequest, IHouseholdProfile, IItemDimensions, INewBuildDetails, IRenovationDetails, IRoomMeasurement } from "../../interfaces/customer/ICustomer";
import type { EditJobRequest } from "../../DTO/user/jobsDTO";


export const roomMeasurementValidation: Joi.ObjectSchema<IRoomMeasurement> = Joi.object<IRoomMeasurement>({
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

export const directHireValidation = roomMeasurementValidation
    .fork(
        ["spaceType"],
        (schema) => schema.strip().optional()
    )
    .fork(
        ["unit"],
        () =>
            Joi.string()
                .valid("ft", "m")
                .required()
                .messages({
                    "any.only": "Unit must be either 'ft' or 'm'",
                    "string.empty": "Unit is required",
                    "any.required": "Unit is required",
                })
    )
    .append({
        designId: Joi.string()
            .regex(/^[a-fA-F0-9]{24}$/)
            .required(),
        services: Joi.array()
            .items(Joi.string())
            .required(),
        timeLine: Joi.string()
            .trim()
            .required(),
    }) as Joi.ObjectSchema<HireDesignerPayload>;


export const itemDimensionsValidation: Joi.ObjectSchema<IItemDimensions> = Joi.object({
    length: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Length must be a number",
            "number.positive": "Length must be greater than 0",
            "any.required": "Length is required",
        }),

    width: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Width must be a number",
            "number.positive": "Width must be greater than 0",
            "any.required": "Width is required",
        }),

    height: Joi.number()
        .positive()
        .optional()
        .messages({
            "number.base": "Height must be a number",
            "number.positive": "Height must be greater than 0",
        }),

    unit: Joi.string()
        .valid("FT", "INCH", "CM", "MM")
        .required()
        .messages({
            "any.only": "Invalid dimension unit",
            "any.required": "Dimension unit is required",
        }),
});

export const householdProfileValidation: Joi.ObjectSchema<IHouseholdProfile> = Joi.object({
    adultsCount: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "Adults count must be a number",
            "number.integer": "Adults count must be a whole number",
            "number.min": "Adults count cannot be negative",
            "any.required": "Adults count is required",
        }),

    kidsCount: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "Kids count must be a number",
            "number.integer": "Kids count must be a whole number",
            "number.min": "Kids count cannot be negative",
            "any.required": "Kids count is required",
        }),

    seniorsCount: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "Seniors count must be a number",
            "number.integer": "Seniors count must be a whole number",
            "number.min": "Seniors count cannot be negative",
            "any.required": "Seniors count is required",
        }),

    hasPets: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "Has pets must be true or false",
            "any.required": "Pet information is required",
        }),

    petDetails: Joi.string()
        .trim()
        .max(500)
        .when("hasPets", {
            is: true,
            then: Joi.required(),
            otherwise: Joi.optional().allow(""),
        })
        .messages({
            "string.max": "Pet details must not exceed 500 characters",
            "any.required": "Pet details are required when you have pets",
        }),
});

export const renovationDetailsValidation: Joi.ObjectSchema<IRenovationDetails> = Joi.object({
    level: Joi.string()
        .valid("DECOR_ONLY", "ROOMS_UPGRADE", "COMPLETE_MAKEOVER")
        .required()
        .messages({
            "any.only": "Invalid renovation level",
            "any.required": "Renovation level is required",
        }),

    propertyAgeYears: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Property age is required",
            "any.required": "Property age is required",
        }),

    livingInDuringRenovation: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "Living-in status must be true or false",
            "any.required": "Living-in status is required",
        }),
});

export const newBuildDetailsValidation: Joi.ObjectSchema<INewBuildDetails> = Joi.object({
    stage: Joi.string()
        .valid("PLANNING", "UNDER_CONSTRUCTION", "BARE_SHELL_READY")
        .required()
        .messages({
            "any.only": "Invalid construction stage",
            "any.required": "Construction stage is required",
        }),

    vastuCompliantRequired: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "Vastu preference must be true or false",
            "any.required": "Vastu preference is required",
        }),
});

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const jobRequestValidation: Joi.ObjectSchema<ICreateJobRequest> = Joi.object<ICreateJobRequest>({

    projectTitle: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Project title is required",
            "string.min":
                "Project title must be at least 3 characters",
            "string.max":
                "Project title must not exceed 100 characters",
            "any.required": "Project title is required",
        }),

    propertyType: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Property type is required",
            "any.required": "Property type is required",
        }),

    projectType: Joi.string()
        .valid("Renovation", "New_Build")
        .required()
        .messages({
            "any.only":
                "Project type must be Renovation or New_Build",
            "any.required": "Project type is required",
        }),

    services: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one service",
            "any.required": "Services are required",
        }),

    designStyles: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one design style",
            "any.required": "Design styles are required",
        }),

    preferredMaterials: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            "array.min":
                "Select at least one preferred material",
            "any.required":
                "Preferred materials are required",
        }),

    householdProfile: householdProfileValidation
        .required(),

    newbuildDetails: newBuildDetailsValidation
        .when("projectType", {
            is: "New_Build",
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),

    renovationDetails: renovationDetailsValidation
        .when("projectType", {
            is: "Renovation",
            then: Joi.required(),
            otherwise: Joi.optional(),
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
            "string.pattern.base":
                "City must contain only letters",
            "any.required": "City is required",
        }),


    sourceType: Joi.string()
        .valid("JOB_REQUEST", "DIRECT_HIRE")
        .required()
        .messages({
            "any.only": "Source type must be either JOB_REQUEST or DIRECT_HIRE.",
            "string.empty": "Source type is required.",
            "any.required": "Source type is required.",
        }),

    designerId: Joi.string()
        .trim()
        .regex(objectIdRegex)
        .when("sourceType", {
            is: "DIRECT_HIRE",
            then: Joi.required().messages({
                "any.required": "Designer ID is required for direct hire.",
                "string.empty": "Designer ID is required for direct hire.",
                "string.pattern.base": "Invalid Designer ID format. Must be a valid 24-character hexadecimal ID.",
            }),
            otherwise: Joi.forbidden().messages({
                "any.unknown": "Designer ID is not allowed for an open job request.",
            }),
        }),

    designId: Joi.string()
        .trim()
        .regex(objectIdRegex)
        .when("sourceType", {
            is: "DIRECT_HIRE",
            then: Joi.required().messages({
                "any.required": "Design ID is required for direct hire.",
                "string.empty": "Design ID is required for direct hire.",
                "string.pattern.base": "Invalid Design ID format. Must be a valid 24-character hexadecimal ID.",
            }),
            otherwise: Joi.forbidden().messages({
                "any.unknown": "Design ID is not allowed for an open job request.",
            }),
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
            "string.pattern.base":
                "District must contain only letters",
            "any.required": "District is required",
        }),

    state: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "State is required",
            "any.required": "State is required",
        }),

    pincode: Joi.string()
        .trim()
        .pattern(/^[1-9][0-9]{5}$/)
        .required()
        .messages({
            "string.empty": "Pincode is required",
            "string.pattern.base":
                "Enter a valid 6-digit Indian pincode",
            "any.required": "Pincode is required",
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base":
                "Enter a valid 10-digit Indian mobile number",
            "any.required": "Phone number is required",
        }),

    totalCarpetArea: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Total carpet area is required",
            "number.positive": "Total carpet area must be greater than 0",
            "any.required": "Total carpet area is required",
        }),

    areaUnit: Joi.string()
        .valid("ft", "m")
        .required()
        .messages({
            "any.only": "Area unit must be ft or m",
            "any.required": "Area unit is required",
        }),

    selectedRooms: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one room",
            "any.required": "At least one room is required",
        }),

    floorPlans: Joi.array()
        .items(Joi.any())
        .optional(),

    requiresSiteVisitMeasurement: Joi.boolean()
        .required()
        .messages({
            "boolean.base":
                "Site visit measurement must be true or false",
            "any.required":
                "Site visit measurement preference is required",
        }),

    timeline: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Timeline is required",
            "any.required": "Timeline is required",
        }),

    minBudget: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Minimum budget is required",
            "number.positive": "Minimum budget must be a positive number",
            "any.required": "Minimum budget is required",
        }),

    maxBudget: Joi.number()
        .positive()
        .precision(2)
        .greater(Joi.ref("minBudget"))
        .required()
        .messages({
            "number.base": "Maximum budget is required",
            "number.positive": "Maximum budget must be a positive number",
            "number.greater": "Maximum budget must be greater than minimum budget",
            "any.required": "Maximum budget is required",
        }),

    description: Joi.string()
        .trim()
        .min(20)
        .max(1000)
        .required()
        .messages({
            "string.empty": "Description is required",
            "string.min":
                "Description must be at least 20 characters",
            "string.max":
                "Description must not exceed 1000 characters",
            "any.required":
                "Description is required",
        })
});

const imageUploadResultValidation = Joi.object({
    path: Joi.string().required(),
    filename: Joi.string().required(),
});



export const EditjobRequestValidation: Joi.ObjectSchema<EditJobRequest> = Joi.object<EditJobRequest>({

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
        .trim()
        .required()
        .messages({
            "string.empty": "Property type is required",
            "any.required": "Property type is required",
        }),

    projectType: Joi.string()
        .valid("Renovation", "New_Build")
        .required()
        .messages({
            "any.only": "Project type must be Renovation or New_Build",
            "any.required": "Project type is required",
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

    renovationDetails: renovationDetailsValidation
        .when("projectType", {
            is: "Renovation",
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),

    newbuildDetails: newBuildDetailsValidation
        .when("projectType", {
            is: "New_Build",
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),

    totalCarpetArea: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Total carpet area is required",
            "number.positive": "Total carpet area must be greater than 0",
            "any.required": "Total carpet area is required",
        }),

    areaUnit: Joi.string()
        .valid("ft", "m")
        .required()
        .messages({
            "any.only": "Area unit must be ft or m",
            "any.required": "Area unit is required",
        }),

    selectedRooms: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one room",
            "any.required": "At least one room is required",
        }),

    requiresSiteVisitMeasurement: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "Site visit measurement must be true or false",
            "any.required": "Site visit measurement preference is required",
        }),

    oldFloorPlans: Joi.array()
        .items(imageUploadResultValidation)
        .optional()
        .default([])
        .messages({
            "array.base": "oldFloorPlans must be an array",
        }),

    services: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one service",
            "any.required": "Services are required",
        }),

    designStyles: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one design style",
            "array.base": "Design styles must be an array",
            "any.required": "Design styles are required",
        }),

    preferredMaterials: Joi.array()
        .items(Joi.string().trim().min(1))
        .min(1)
        .required()
        .messages({
            "array.min": "Select at least one preferred material",
            "any.required": "Preferred materials are required",
        }),

   
    oldReferences: Joi.array()
        .items(imageUploadResultValidation)
        .optional()
        .default([])
        .messages({
            "array.base": "oldReferences must be an array",
        }),

    householdProfile: householdProfileValidation.required(),

    state: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "State is required",
            "any.required": "State is required",
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

    pincode: Joi.string()
        .trim()
        .pattern(/^[1-9][0-9]{5}$/)
        .required()
        .messages({
            "string.empty": "Pincode is required",
            "string.pattern.base": "Enter a valid 6-digit Indian pincode",
            "any.required": "Pincode is required",
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
        .trim()
        .required()
        .messages({
            "string.empty": "Timeline is required",
            "any.required": "Timeline is required",
        }),

    minBudget: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Minimum budget is required",
            "number.positive": "Minimum budget must be a positive number",
            "any.required": "Minimum budget is required",
        }),

    maxBudget: Joi.number()
        .positive()
        .precision(2)
        .greater(Joi.ref("minBudget"))
        .required()
        .messages({
            "number.base": "Maximum budget is required",
            "number.positive": "Maximum budget must be a positive number",
            "number.greater": "Maximum budget must be greater than minimum budget",
            "any.required": "Maximum budget is required",
        }),
});


