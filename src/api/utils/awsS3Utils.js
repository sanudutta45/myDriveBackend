const { S3_ORIGINAL_FOLDER_ID } = require("../constants/aws")
exports.generateRawObjKey = (userId, fileName) => {
  const key = `${userId}/${S3_ORIGINAL_FOLDER_ID}/${fileName}`
  return key
}
