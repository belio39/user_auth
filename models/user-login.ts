import Joi from "joi";

export const logInSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
