import Joi from "joi";
import type { ISavedDesignDTO } from "../../interfaces/customer/ISavedDesign";

export const SavedDesignValidators: Joi.ObjectSchema<ISavedDesignDTO> = Joi.object<ISavedDesignDTO>({
    isSaved: Joi.boolean().required(),
    designId: Joi.string().required()
})