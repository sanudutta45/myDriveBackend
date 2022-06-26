const s3 = require("../../config/awsS3")
const { S3_BUCKET_ID } = require("../constants/aws")
const { generateRawObjKey } = require("../utils/awsS3Utils")

exports.createUploadId = async (fileName, userId) => {
  const params = {
    Bucket: S3_BUCKET_ID,
    Key: generateRawObjKey(userId, fileName),
  }

  try {
    const { UploadId } = await s3.createMultipartUpload(params).promise()
    return UploadId
  } catch (error) {
    throw new Error("Failed to create upload Id")
  }
}

exports.getPreSignedPutUrls = async (
  userId,
  fileName,
  uploadId,
  totalPartCount
) => {
  const baseParams = {
    Bucket: S3_BUCKET_ID,
    Key: generateRawObjKey(userId, fileName),
    UploadId: uploadId,
    Expires: 3600,
  }

  const promises = []

  for (let index = 0; index < totalPartCount; index++) {
    promises.push(
      s3.getSignedUrlPromise("uploadPart", {
        ...baseParams,
        PartNumber: index + 1,
      })
    )
  }

  try {
    const result = await Promise.all(promises)

    const partIndexMap = result.reduce((map, part, index) => {
      map[index] = part
      return map
    }, {})

    return partIndexMap
  } catch (error) {
    throw new Error("Failed to create signed url")
  }
}

exports.getPreSignedGetUrls = async (userId, fileName, bucketFileName) => {
  const params = {
    Bucket: S3_BUCKET_ID,
    Key: generateRawObjKey(userId, bucketFileName),
    Expires: 3600,
    ResponseContentDisposition: `attachment; filename=${fileName}`,
  }

  try {
    const result = await s3.getSignedUrlPromise("getObject", params)

    return result
  } catch (error) {
    throw new Error("Failed to create signed url")
  }
}

exports.completeMultipartUpload = async (uploadId, userId, fileName, parts) => {
  //Params
  const params = {
    Bucket: S3_BUCKET_ID,
    Key: generateRawObjKey(userId, fileName),
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  }
  try {
    await s3.completeMultipartUpload(params).promise()
    return true
  } catch (e) {
    throw new Error("Error to complete multipart upload")
  }
}

exports.abortMultipartUpload = async (userId, fileName, uploadId) => {
  //Params
  const params = {
    Bucket: S3_BUCKET_ID,
    Key: generateRawObjKey(userId, fileName),
    UploadId: uploadId,
  }
  try {
    await s3.abortMultipartUpload(params).promise()
    return true
  } catch (e) {
    throw new Error("Error aborting multipart upload")
  }
}
