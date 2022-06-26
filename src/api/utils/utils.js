const passport = require("passport");

exports.isValidPassword = (password) => {
  const re = /[A-Fa-f0-9]{64}/g;
  return !re.test(password);
};

exports.transformUser = (user) => {
  const userObj = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    lastLoginAt: user.lastLoginAt,
  };
  return userObj;
};
