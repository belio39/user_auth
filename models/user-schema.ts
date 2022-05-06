import Joi from "joi";

export const userSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20).required(),
  fullName: Joi.string().min(3).max(20).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  age: Joi.number().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  role: Joi.string().required(),
});
