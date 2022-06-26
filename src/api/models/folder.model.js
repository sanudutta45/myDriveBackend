const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bucketFileName: {
      type: String,
      required: false,
      trim: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    path: {
      type: Array,
      default: [],
    },
    status: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isDir: {
      type: Boolean,
      default: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

/**
 * @typedef user
 */

module.exports = mongoose.model("folder", userSchema, "folders")
