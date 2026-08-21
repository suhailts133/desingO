import Joi from "joi";
import { fileValidator } from "../helpers/imageValidation";
import type { FloorPlans } from "../features/proposal/proposalInterface";
export const floorPlanValidation: Joi.ObjectSchema<FloorPlans> = Joi.object<FloorPlans>({

    floorPlans: Joi.array()
        .min(1)
        .items(Joi.object({ file: fileValidator("evidence") })),

});
