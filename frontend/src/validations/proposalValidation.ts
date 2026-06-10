import Joi from "joi"
import type { ServiceItem, CreateProposalDTO, IServiceResult } from "../features/proposal/proposalInterface"
import { imageValidation } from "../helpers/imageValidation"


const serviceItemValidation = Joi.object<ServiceItem>({
    serviceName: Joi.string()
        .required()
        .messages({
            "string.empty": "Service name is required",
            "any.required": "Service name is required",
        }),
    order: Joi.number()
        .required(),
    price: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.positive": "Price must be positive",
            "any.required": "Price is required",
        }),
    executionPrice: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Execution price must be a number",
            "number.positive": "Execution price must be positive",
            "any.required": "Execution price is required",
        }),

    expectedDeliveryDate: Joi.date()
        .greater("now")
        .required()
        .messages({
            "date.base": "Expected delivery date is required",
            "date.greater": "Expected delivery date must be in the future",
            "any.required": "Expected delivery date is required",
        }),
})

export const proposalValidation: Joi.ObjectSchema<CreateProposalDTO> = Joi.object<CreateProposalDTO>({
    sourceId: Joi.string()
        .required(),
    sourceType: Joi.string()
        .valid("jobRequest", "direct_hire")
        .required(),
    drawingFeePerSqFt: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Drawing fee must be a number",
            "number.positive": "Drawing fee must be positive",
            "any.required": "Drawing fee is required",
        }),
    expectedCompletionDate: Joi.date()
        .greater("now")
        .required()
        .messages({
            "date.base": "Expected completion date is required",
            "date.greater": "Expected completion date must be in the future",
            "any.required": "Expected completion date is required",
        }),
    services: Joi.array()
        .items(serviceItemValidation)
        .min(1).required()
        .messages({
            "array.min": "At least one service is required",
            "any.required": "Services are required",
        }),
})


export const serviceResultUploadValidatin:Joi.ObjectSchema<IServiceResult> = Joi.object<IServiceResult>({
     serviceResult: Joi.array()
            .items(
                Joi.object({
                    file: imageValidation("service result", true)
                })
            )
            .default([]),
})