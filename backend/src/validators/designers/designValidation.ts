import Joi from "joi";
import type { AddDesignRequestDTO } from "../../DTO/designer/designDTO.js";


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
    startingPrice: Joi.number()
        .required()
        .messages(
            { "string.empty": "Price is required" }
        )

});