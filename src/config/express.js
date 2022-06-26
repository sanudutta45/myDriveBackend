const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const strategies = require("./passport");

const routes = require("../api/routes/v1");
const {logs} = require("./vars");

const bearerToken = require("express-bearer-token");

/**
 * Express instance
 * @public
 */

 const app = express();

 // request logging dev:console | production: file
 app.use(morgan(logs));

 //parse body params and attache them to req.body
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:true}));

 //gzip compression
 app.use(compress());

 //lets yo use HTTP verbs such as PUT or DELETE
 // in places where the client doesn't support it
 app.use(methodOverride());

 // secure apps by setting various HTTP headers
 app.use(helmet());

 //enable CORS- cross origin resource sharing
 app.use(cors());

 //get bearer token as req.token
 app.use(bearerToken());

 app.use(passport.initialize());
 passport.use("register", strategies.register);
 passport.use("local", strategies.local);
 passport.use("jwt",strategies.jwt);

 // mount api v1 routes
 app.use("/api/v1", routes);

 module.exports = app;