const express = require("express")
const { validate } = require("express-validation")
const controller = require("../../controllers/file.controller")

const reqAuth = require("../../middlewares/reqAuth")
const {
  uploadIdSchema,
  vOptions,
  signedUrlSchema,
  abortUploadSchema,
  deleteFileSchema,
  saveUploadedFileSchema,
  downloadFileSchema,
} = require("../../validations/file.validation")

const router = express.Router()

router
  .route("/upload_id/:fileName")
  .get(
    reqAuth.authorize,
    validate(uploadIdSchema, vOptions),
    controller.awsFileUploadId
  )

router
  .route("/signed_url")
  .post(
    reqAuth.authorize,
    validate(signedUrlSchema, vOptions),
    controller.awsPresignedUrlParts
  )

router
  .route("/save")
  .post(
    reqAuth.authorize,
    validate(saveUploadedFileSchema, vOptions),
    controller.saveFile
  )

router
  .route("/abort_upload")
  .post(
    reqAuth.authorize,
    validate(abortUploadSchema, vOptions),
    controller.abortUpload
  )

router
  .route("/delete/:fileId")
  .put(
    reqAuth.authorize,
    validate(deleteFileSchema, vOptions),
    controller.delete
  )

router
  .route("/download/:fileId")
  .get(
    reqAuth.authorize,
    validate(downloadFileSchema, vOptions),
    controller.download
  )

module.exports = router
