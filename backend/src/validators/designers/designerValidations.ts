import Joi from "joi";
import type { DesignerFilter } from "../../DTO/designer/designerDTO.js";

export const DesignerQueryFilter: Joi.ObjectSchema<DesignerFilter> = Joi.object<DesignerFilter>({
    page: Joi.string().pattern(/^[0-9]+$/),
    full_name: Joi.string().optional()
})