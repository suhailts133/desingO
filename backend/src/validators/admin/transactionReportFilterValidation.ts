import Joi from "joi";
import { VALID_GROUP_BY, VALID_TYPES, type ReportQueryParams, } from "../../DTO/common/transaction";


export const transactionReportQueryValidation: Joi.ObjectSchema<ReportQueryParams> = Joi.object({
    groupBy: Joi.string()
        .valid(...VALID_GROUP_BY)
        .default("week"),

    from: Joi.string().isoDate().when("groupBy", {
        is: "custom",
        then: Joi.required(),
        otherwise: Joi.forbidden(),
    }),

    to: Joi.string().isoDate().when("groupBy", {
        is: "custom",
        then: Joi.required(),
        otherwise: Joi.forbidden(),
    }),

    type: Joi.string().valid(...VALID_TYPES),
});
