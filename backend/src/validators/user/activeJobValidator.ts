import Joi, { type ObjectSchema } from "joi";
import type { ActiveJobFilter } from "../../DTO/user/activeJobDTO";


export const activeJobFilterSchema: ObjectSchema<ActiveJobFilter> = Joi.object<ActiveJobFilter>({
    sourceType: Joi.string()
        .valid("jobRequest", "direct_hire")
        .optional(),
    page: Joi.string()
        .optional()
});