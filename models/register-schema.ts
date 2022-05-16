import Joi from "joi";

export const RegisterSchema = Joi.object({
  password: Joi.string()
    .min(3)
    .max(13)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
