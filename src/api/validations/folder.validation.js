const { Joi } = require("express-validation")

module.exports = {
  addfolderSchema: {
    body: Joi.object({
      name: Joi.string().required(),
      path: Joi.array().required(),
    }),
  },
  renamefolderSchema: {
    params: Joi.object({
      folderId: Joi.string().required(),
    }),
    body: Joi.object({
      newName: Joi.string().required(),
    }),
  },
  deletefolderSchema: {
    params: Joi.object({
      folderId: Joi.string().required(),
    }),
  },
}
