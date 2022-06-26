const express = require("express");
const controller = require("../../controllers/file.controller");

const reqAuth = require("../../middlewares/reqAuth");

// const uploadFile = require("../../middlewares/uploadFile");

const router = express.Router();

router.route("/upload").post(reqAuth.authorize, controller.uploadFile);

module.exports = router;
