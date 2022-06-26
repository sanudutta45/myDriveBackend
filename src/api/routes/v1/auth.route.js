const express = require("express");
const {validate} = require("express-validation");

const controller = require("../../controllers/auth.controller");

const {
    vOptions,
    registerSchema,
    loginSchema
} = require("../../validations/auth.validation");

const router = express.Router();

router.route("/register").post(validate(registerSchema, vOptions), controller.register);

router.route("/signin").post(validate(loginSchema, vOptions), controller.signin);

module.exports = router;