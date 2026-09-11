import Joi from "joi";
import { selectOptionSchema } from "./customerValidation";
import type { IDesignerPreferencePayload } from "../features/designer/profile/designerProfileInterface";

export const designerPreferenceValidation = Joi.object<IDesignerPreferencePayload>({
    propertyType: Joi.array().items(selectOptionSchema).min(1).required().messages({
        "array.min": "Select at least one property type",
    }),
    designStyle: Joi.array().items(selectOptionSchema).min(1).required().messages({
        "array.min": "Select at least one design style",
    }),
});