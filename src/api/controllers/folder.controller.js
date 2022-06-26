const Folder = require("../models/folder.model");

exports.addFolder = async (req, res) => {
  const { name, path } = req.body;
  const id = req.query.id === "null" ? null : req.query.id;

  const folder = new Folder({
    name: name,
    path: path,
    userId: req.user.sub,
    parentId: id,
  });

  try {
    const findFolder = await Folder.findOne({
      userId: req.user.sub,
      parentId: id,
      name: name,
    });

    if (findFolder)
      return res.status(403).json({ error: "Directory already exists." });

    await folder.save();

    return res.json({
      success: true,
      code: 200,
      message: "Folder added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      error: "Failed to add folder",
    });
  }
};

exports.getFolderInfo = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await Folder.findOne({ _id: id, userId: req.user.sub });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      error: "Failed to get folder",
    });
  }
};

exports.getChildren = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await Folder.find({ parentId: id, userId: req.user.sub });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      error: "Failed to get child folder",
    });
  }
};
