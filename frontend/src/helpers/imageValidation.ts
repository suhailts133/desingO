import Joi from "joi";

export const imageValidation = (fieldName: string, isOptional = false) => {
    const validator = Joi.any()
        .custom((value, helpers) => {
            const file = value?.[0];

            if (!file) {
                if (isOptional) return value;
                return helpers.error("any.required");
            }

            const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
            const maxSize = 5 * 1024 * 1024;
            if (!allowedMimeTypes.includes(file.type)) {
                return helpers.error("any.invalid");
            }

            if (file.size > maxSize) {
                return helpers.error("any.invalid");
            }

            return value;
        })
        .messages({
            "any.required": `${fieldName} is required`,
            "any.invalid": `${fieldName} must be a valid image (jpeg, jpg, png, webp)`
        });

    return isOptional ? validator.optional() : validator.required();
};

export const fileValidator = (fieldName: string, isOptional = false) => {
    const validator = Joi.any()
        .custom((value, helpers) => {
            const file = value?.[0];

            if (!file) {
                if (isOptional) return value;
                return helpers.error("any.required");
            }

            const allowedMimeTypes = ["application/pdf"];
            const maxSize = 5 * 1024 * 1024;
            if (!allowedMimeTypes.includes(file.type)) {
                return helpers.error("any.invalid");
            }

            if (file.size > maxSize) {
                return helpers.error("any.invalid");
            }

            return value;
        })
        .messages({
            "any.required": `${fieldName} is required`,
            "any.invalid": `${fieldName} must be a valid image (jpeg, jpg, png, webp)`
        });

    return isOptional ? validator.optional() : validator.required();
};
