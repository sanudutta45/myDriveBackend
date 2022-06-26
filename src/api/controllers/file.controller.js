const Folder = require("../models/folder.model");

const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`./uploads/${req.user.sub}`))
      fs.mkdirSync(`./uploads/${req.user.sub}`);

    cb(null, `./uploads/${req.user.sub}`);
  },
  filename: function (req, file, cb) {
    let folderName = req.query.id;
    if (folderName == "null") folderName = "";
    cb(
      null,
      folderName + "_" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
}).single("file");

exports.uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(403).json({ error: err });
    if (req.file == undefined)
      return res.status(403).json({ error: "No file selected" });

    const id = req.query.id === "null" ? null : req.query.id;

    try {
      await Folder.updateOne(
        {
          name: req.file.originalname,
          userId: req.user.sub,
          parentId: id,
          isDir: false,
        },
        { $set: { size: req.file.size } },
        { upsert: true }
      );

      return res.json({
        success: true,
        code: 200,
        message: "File added successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(403).json({
        error: "Failed to add file",
      });
    }
  });
};
