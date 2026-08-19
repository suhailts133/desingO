import Joi from "joi";
import type { IBid, IJobRequest, RoomMeasurement } from "../features/user/jobs/jobInterface";
import { fileValidator, imageValidation } from "../helpers/imageValidation";

export const selectOption = Joi.object({
  value: Joi.string().required(),
  label: Joi.string().required(),
});


export const bidValidation: Joi.ObjectSchema<IBid> = Joi.object<IBid>({
  timeLine: selectOption.required().messages({
    "object.base": "Timeline is required",
    "any.required": "Timeline is required",
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
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Budget must be a number",
      "number.positive": "Budget must be positive",
      "any.required": "Budget is required",
    }),

})


const roomMeasurementValidation: Joi.ObjectSchema<RoomMeasurement> = Joi.object<RoomMeasurement>({
  spaceType: selectOption.required()
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
  unit: selectOption.required()
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


export const directHireValidation = roomMeasurementValidation.fork(
  ['spaceType'],
  (schema) => schema.strip().optional(),
).append({
  timeLine: selectOption.required().messages({
    "object.base": "Timeline is required",
    "any.required": "Timeline is required",
  }),
  services: Joi.array()
    .items(selectOption)
    .min(1)
    .required()
    .messages({
      "array.base": "Services must be an array",
      "array.min": "At least one service is required",
      "any.required": "Services is required",
    }),

})

const selectOptionSchema = Joi.object({
  value: Joi.string().required(),
  label: Joi.string().required(),
}).messages({
  "object.base": "Selection is required",
  "any.required": "Selection is required",
});

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const jobRequestValidation = Joi.object<IJobRequest>({
  projectTitle: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Project title is required",
    "string.min": "Title must be at least 3 characters",
    "any.required": "Project title is required",
  }),

  description: Joi.string().trim().min(20).max(1500).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 20 characters",
    "any.required": "Description is required",
  }),

  projectType: Joi.string().valid("Renovation", "New_Build").required().messages({
    "any.required": "Please select project type",
  }),

  propertyType: selectOptionSchema.required(),
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


  renovationDetails: Joi.object({
    level: Joi.string().valid("DECOR_ONLY", "ROOMS_UPGRADE", "COMPLETE_MAKEOVER").required(),
    propertyAgeYears: Joi.string().trim().required(),
    livingInDuringRenovation: Joi.boolean().required(),
  }).when("projectType", {
    is: "Renovation",
    then: Joi.required(),
    otherwise: Joi.optional().allow(null),
  }),


  newbuildDetails: Joi.object({
    stage: Joi.string().valid("PLANNING", "UNDER_CONSTRUCTION", "BARE_SHELL_READY").required(),
    vastuCompliantRequired: Joi.boolean().required(),
  }).when("projectType", {
    is: "New_Build",
    then: Joi.required(),
    otherwise: Joi.optional().allow(null),
  }),

  totalCarpetArea: Joi.number().positive().required().messages({
    "number.base": "Enter valid carpet area",
    "number.positive": "Carpet area must be greater than 0",
    "any.required": "Carpet area is required",
  }),

  areaUnit: Joi.string().valid("ft", "m").default("ft").required(),

  selectedRooms: Joi.array().items(selectOptionSchema).min(1).required().messages({
    "array.min": "Select at least one room",
    "any.required": "Select at least one room",
  }),

  requiresSiteVisitMeasurement: Joi.boolean().required(),

  floorPlans: Joi.array()
    .items(Joi.object({ file: fileValidator("Floor plan", true) }))
    .when("requiresSiteVisitMeasurement", {
      is: false,
      then: Joi.array().min(1).messages({
        "array.min": "Upload at least one floor plan or check in-person site visit",
      }),
      otherwise: Joi.optional().default([]),
    }),

  servicePackageType: Joi.string().valid("CONCEPT", "CONTRACTOR_READY", "CUSTOM").required(),

  services: Joi.array().items(selectOptionSchema).min(1).required().messages({
    "array.min": "Select at least one deliverable service",
  }),

  designStyles: Joi.array().items(selectOptionSchema).min(1).required().messages({
    "array.min": "Select at least one design style",
  }),

  preferredMaterials: Joi.array().items(selectOptionSchema).default([]),


  householdProfile: Joi.object({
    adultsCount: Joi.number().integer().min(0).required(),
    kidsCount: Joi.number().integer().min(0).required(),
    seniorsCount: Joi.number().integer().min(0).required(),
    hasPets: Joi.boolean().required(),
    petDetails: Joi.string().trim().max(300).when("hasPets", {
      is: true,
      then: Joi.required().messages({ "any.required": "Please provide pet details" }),
      otherwise: Joi.optional().allow(""),
    }),
  }).required(),

  state: Joi.string().trim().required().messages({ "string.empty": "State is required" }),
  district: Joi.string().trim().required().messages({ "string.empty": "District is required" }),
  city: Joi.string().trim().required().messages({ "string.empty": "City is required" }),
  pincode: Joi.string().trim().pattern(/^[1-9][0-9]{5}$/).required().messages({
    "string.pattern.base": "Enter valid 6-digit Indian PIN code",
    "string.empty": "Pincode is required",
  }),
  phone: Joi.string().trim().pattern(/^[6-9]\d{9}$/).required().messages({
    "string.pattern.base": "Enter valid 10-digit mobile number",
    "string.empty": "Phone number is required",
  }),

  timeline: selectOptionSchema.required(),
  minBudget: Joi.number().positive().required().messages({
    "number.base": "Min budget is required",
  }),
  maxBudget: Joi.number().positive().greater(Joi.ref("minBudget")).required().messages({
    "number.greater": "Max budget must exceed minimum budget",
  }),

  referenceImages: Joi.array().items(
    Joi.object({ file: imageValidation("Reference image", true) })
  ).optional().default([]),
});

export const editJobRequestValidation = jobRequestValidation.fork(
  ['referenceImages', 'floorPlans'],
  () => Joi.any().strip()
);