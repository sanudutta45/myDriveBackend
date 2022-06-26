const { Joi } = require("express-validation");
const utils = require("../utils/utils");

const vOptions = { statusCode: 422, keyByField: true };

//methods
const validPassword = (value, helpers) => {
  //Use error to return an existing error code
  if (utils.isValidPassword(value)) {
    return helpers.error("custom_password_validation");
  }

  return value;
};

module.exports = {
  vOption: vOptions,

  // user register schema
  registerSchema: {
    body: Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .custom(validPassword, "custom_password_validation")
        .message({
          custom_password_validation: "password is invalid",
        }),
    }),
  },

  //user signin schema
  loginSchema: {
    body: Joi.object({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .custom(validPassword, "custom_password_validation")
        .messages({
          custom_password_validation: "password is invalid",
        }),
    }),
  },
};
