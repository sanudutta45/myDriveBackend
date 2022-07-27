const dotenvFlow = require("dotenv-flow")

dotenvFlow.config() //default will take .env file

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  mongo: {
    uri: process.env.MONGO_URI,
  },
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  jwtRefreshToken: process.env.JWT_REFRESH_TOKEN_DAYS,
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  fileSlizeSize: process.env.SLICE_SIZE
}
