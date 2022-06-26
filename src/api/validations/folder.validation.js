const { Joi } = require("express-validation");

module.exports = {
  addfolderSchema: {
    body: Joi.object({
      name: Joi.string().required(),
      path: Joi.array().required(),
    }),
  },
};
