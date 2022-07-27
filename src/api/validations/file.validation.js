const { Joi } = require("express-validation")
const mongoose = require("mongoose")

const vOptions = { statusCode: 422, keyByField: true }

// methods
const validMongoId = (value, helpers) => {
  // Use error to return an existing error code
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("custom_mongo_id_validation")
  }

  // Return the value unchanged
  return value
}

module.exports = {
  vOptions: vOptions,

  // signed url schema
  uploadIdSchema: {
    params: Joi.object({
      fileName: Joi.string().required(),
    }),
  },

  signedUrlSchema: {
    body: Joi.object({
      bucketFileName: Joi.string().required(),
      fileSize: Joi.number().required(),
    }),
  },

  // save uploaded file schema
  saveUploadedFileSchema: {
    body: Joi.object({
      fileName: Joi.string().required(),
      uploadId: Joi.string().required(),
      parts: Joi.array().required(),
      bucketFileName: Joi.string().required(),
      fileSize: Joi.number().required(),
    }),
  },

  // abort upload file schema
  abortUploadSchema: {
    body: Joi.object({
      bucketFileName: Joi.string().required(),
      uploadId: Joi.string().required(),
    }),
  },

  deleteFileSchema: {
    params: Joi.object({
      fileId: Joi.string().required(),
    }),
  },

  downloadFileSchema: {
    params: Joi.object({
      fileId: Joi.string().required(),
    }),
  },
}
