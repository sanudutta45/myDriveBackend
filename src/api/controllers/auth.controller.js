const passport = require("passport");
//models
const User = require("../models/user.model");

//utils
const tokenUtils = require("../utils/tokenUtils");
const utils = require("../utils/utils");

exports.register = async (req, res, next) => {
  const { name } = req.body;
  passport.authenticate(
    "register",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        console.log("register", err);
        return res
          .status(403)
          .json({ error: info ? info.message : "Registration failed" });
      }
      const logIn = Promise.promisify(req.logIn);
      try {
        await logIn(user, { session: false });

        const updateUser = { firstName: name, lastLoginAt: Date.now() };
        user = await User.findOneAndUpdate({ _id: user._id }, updateUser, {
          new: true,
        });

        const token = await tokenUtils.createToken(user);
        const transformUser = utils.transformUser(user);
        const result = {
          user: transformUser,
          token,
        };
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ error: "Unable to create user" });
      }
    }
  )(req, res, next);
};

exports.signin = async(req,res,next) =>{
  passport.authenticate("local",{session:false}, async(err,user,info)=>{
    if(err || !user){
      console.log("login",err);
      return res.status(403).json({error: info? info.message : "Login failed"});
    }

    const logIn = Promise.promisify(req.logIn);
    try{
      await logIn(user,{session:false});
      await User.findOneAndUpdate({_id:user._id},{lastLoginAt: Date.now()},{new:true});

      //send token to the user
      const token = await tokenUtils.createToken(user);
      const transformUser = utils.transformUser(user);
      const message="Logged in successfully";
      const result = {
        user: transformUser,
        token,
        message:message
      }
      console.log("logged in user_id: %s",user._id);
      res.status(200).json(result);
    }catch(error){
      console.log("Login failed",user._id);
      res.status(400).json({error: "Unable to get user"});
    }
  })(req,res,next);
}
