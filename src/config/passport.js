const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

//models
const User = require("../api/models/user.model");

const LocalStrategy = require("passport-local").Strategy;

const { jwtSecret } = require("./vars");

const jwtOptions = {
    secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
};

const register = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return done(null, false, {
        message:
          "An account already exists with that email address. Please sign in.",
      });
    }
    const reqBody = {
      email: email,
      password: password,
    };
    const newUser = await new User(reqBody).save();

    return done(null, newUser, { message: "User created successfully" });
  } catch (error) {
    return done(error, false);
  }
};

const local = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return done(null, false, { message: "User not found" });
    }
    // check, password is correct or not
    const isPassword = await user.passwordMatches(password, user.password);
    if (!isPassword) {
      return done(null, false, { message: "Incorrect email or password" });
    }

    return done(null, user, { message: "Logged-in successfully" });
  } catch (error) {
    return done(error, false);
  }
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.sub });
    if (user) {
      const result = {
        user,
        payload,
      };
      return done(null, result);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.register = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  register
);

exports.local = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  local
);

exports.jwt = new JwtStrategy(jwtOptions, jwt);
