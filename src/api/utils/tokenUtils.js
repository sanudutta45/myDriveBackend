const moment = require("moment");
const jwt = require("jsonwebtoken");

const {jwtSecret, jwtExpirationInterval, jwtRefreshToken} = require("../../config/vars");

getAccessToken = (user, expiresIn) =>{
    //access token
    const payload = {
        exp:expiresIn,
        iat: moment().unix(),
        sub: user._id,
        email:user.email,
        firstName: user.firstName,
    };
    const accessToken = jwt.sign(payload, jwtSecret);
    return accessToken;
}

getRefreshToken = (user)=>{
    //refresh token
    const expiresIn = moment().add(jwtRefreshToken,"days").unix();
    
    const payload = {
        exp:expiresIn,
        iat: moment().unix(),
        sub:user._id,
        email:user.email,
        firstName:user.firstName,
        isRefreshToken: true
    }
    const refreshToken = jwt.sign(payload, jwtSecret);
    return refreshToken;
}

exports.createToken = async(user) =>{
    const expiresIn = moment().add(jwtExpirationInterval,"minutes").unix();
    const accessToken = getAccessToken(user,expiresIn);
    const refreshToken = getRefreshToken(user);

    return {accessToken,expiresIn,refreshToken};
}

exports.extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
      return token;
    } else {
      return null;
    }
  };
