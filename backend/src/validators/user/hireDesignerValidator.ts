import Joi from "joi";
import type { HireDesignerPayload } from "../../interfaces/customer/ICustomer";
import { roomMeasurementValidation } from "./jobValidator";
import { JobApplicationsQueryFilter } from "../designers/jobApplicationValidations";
import type { HireDesignerFilter } from "../../DTO/user/hireDesignerDTO";

export const directHireValidation = roomMeasurementValidation
    .fork(
        ['spaceType'],
        (schema) => schema.strip().optional()
    )
    .append({
        services: Joi.array()
            .items(Joi.string())
            .required()
            .messages({
                "array.base": "Services must be an array",
                "any.required": "Services is required",
            }),
        timeLine: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Timeline is required",
                "any.required": "Timeline is required",
            }),
    }) as Joi.ObjectSchema<HireDesignerPayload>


export const directHireQueryFilters = JobApplicationsQueryFilter.fork(
    ["status"],
    (schema) => schema.strip().optional()
) as Joi.ObjectSchema<HireDesignerFilter>
