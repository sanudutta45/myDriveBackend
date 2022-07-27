const fileService = require("../services/awsS3.service")
const Folder = require("../models/folder.model")
const User = require("../models/user.model")

const { fileSlizeSize } = require("../../config/vars")
// exports.awsFileUploadId = async (req, res) => {
//   const { fileName } = req.params
//   const { sub } = req.user
//   try {
//     const uploadId = await fileService.createUploadId(fileName, sub)
//     res.status(200).json(uploadId)
//   } catch (error) {
//     console.log("Unable to get upload Id", error)
//     res.status(400).json({ error: "Unable to get upload Id" })
//   }
// }

exports.awsPresignedUrlParts = async (req, res) => {
  const { fileSize, bucketFileName } = req.body
  const { sub } = req.user

  try {
    const user = await User.findById(sub)
    if (user?.uploadLimit <= 0)
      return res.status(403).json({ error: "Max upload limit exceed" })
    else if (fileSize > user?.maxFileSize)
      return res.status(403).json({ error: "Max file size exceed" })

    const uploadId = await fileService.createUploadId(bucketFileName, sub)

    const noOfParts = Math.floor(fileSize / parseInt(fileSlizeSize)) + 1

    const partIndexMap = await fileService.getPreSignedPutUrls(
      sub,
      bucketFileName,
      uploadId,
      noOfParts
    )

    const result = {
      uploadId,
      partUrls: partIndexMap,
      sliceSize: fileSlizeSize,
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log("Error for Signed URL", error)
    return res
      .status(403)
      .json({ error: "Failed to create signed url" + error })
  }
}

exports.saveFile = async (req, res) => {
  const { fileName, uploadId, parts, fileSize, bucketFileName } = req.body
  const { sub } = req.user
  let id = req.query.id

  id = id === "null" ? null : id

  const promises = []

  promises.push(
    fileService.completeMultipartUpload(uploadId, sub, bucketFileName, parts)
  )

  promises.push(
    Folder.updateOne(
      {
        name: fileName,
        bucketFileName,
        userId: req?.user?.sub,
        parentId: id,
        isDir: false,
      },
      { $set: { size: fileSize } },
      { upsert: true }
    )
  )

  promises.push(
    User.updateOne({ _id: req?.user?.sub }, { $inc: { uploadLimit: -1 } })
  )
  try {
    const result = await Promise.all(promises)

    if (result[0])
      return res.json({
        message: "success",
        data: "File upload is successful",
      })
  } catch (error) {
    console.log(`API has error ${req.originalUrl} by user`, error)
    return res.status(403).json({ error: "save upload failed" + error })
  }
}

exports.abortUpload = async (req, res) => {
  const { uploadId, bucketFileName } = req.body
  const { sub } = req.user

  try {
    const result = await fileService.abortMultipartUpload(
      sub,
      bucketFileName,
      uploadId
    )
    if (result)
      res.json({ message: "success", data: "Upload aborted successfully" })
  } catch (error) {
    console.log("aborting upload failed ", error)
    return res.status(403).json({ error: "aborting upload failed" + error })
  }
}

exports.delete = async (req, res) => {
  const { sub } = req.user
  const { fileId } = req.params

  try {
    const found = await Folder.findOneAndDelete({
      _id: fileId,
      isDir: false,
      userId: sub,
    })

    if (!found) return res.status(403).json({ error: "Folder not found" })

    return res.status(200).json({
      message: "File deleted successfully",
    })
  } catch (error) {
    return res.status(403).json({
      error: "Failed to delete file",
    })
  }
}

exports.download = async (req, res) => {
  const { sub } = req.user
  const { fileId } = req.params

  try {
    const found = await Folder.findOne({
      _id: fileId,
      userId: sub,
      isDir: false,
    })

    if (!found) return res.status(403).json({ message: "File not found" })
    const downloadUrl = await fileService.getPreSignedGetUrls(
      sub,
      found.name,
      found.bucketFileName
    )

    return res.status(200).json({
      message: "File download url",
      url: downloadUrl,
    })
  } catch (error) {
    return res.status(403).json({ message: "File not found" })
  }
}
