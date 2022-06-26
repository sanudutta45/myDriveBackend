const S3 = require("aws-sdk/clients/s3")
const { s3AccessKeyId, s3SecretAccessKey } = require("./vars")

const s3 = new S3({
  region: "ap-south-1",
  accessKeyId: s3AccessKeyId,
  secretAccessKey: s3SecretAccessKey,
  signatureVersion: "v4",
})

module.exports = s3
