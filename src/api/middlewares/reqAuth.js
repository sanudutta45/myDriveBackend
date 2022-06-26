const lodash = require("lodash");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// services
// const logger = require("../services/logger");
const tokenUtils = require("../utils/tokenUtils");
const { jwtSecret } = require("../../config/vars");

// models
const User = require("../models/user.model");

exports.authorize = async (req, res, next) => {
  const token = tokenUtils.extractToken(req);
  if (lodash.isEmpty(token)) {
    return res.status(403).json({ error: "Token is required" });
  } else {
    try {
      const payload = await jwt.verify(token, jwtSecret);
      if (payload) {
        if (mongoose.Types.ObjectId.isValid(payload.sub)) {
          let user = await User.findOne({ _id: payload.sub });
          payload.sub = user._id;
        }

        req.user = payload;

        return next();
      } else {
        res.status(401).json({ error: "Unauthorised user" });
      }
    } catch (error) {
      if (error.name && error.name === "TokenExpiredError") {
        res.status(401).json({ error: "Token expired" });
      } else {
        // logger.error("Unable to get token", error);
        res.status(400).json({ error: "Unable to get token" });
      }
    }
  }
};
