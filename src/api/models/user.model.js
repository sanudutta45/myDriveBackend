const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
  },
  password:{
      type:String,
      required:true,
      minlength: 6,
      maxlength: 128
  },
  firstName:{
      type: String,
      maxlength: 128,
      index: true,
      ddefault:""
  },
  lastName:{
      type: String,
      maxlength: 128,
      trim: true,
      default:""
  },
  phoneNumber:{
      type:String,
      maxlength: 128,
      trim:true,
      default:""
  },
  lastLoginAt:{
      type: Date,
      default: Date.now
  },
  loginFailedAttempts:{
      type: Number,
      default: 0
  }
},{
    timestamps:true
});

/**
 * Add your
 * -pre-save hooks
 * -validations
 * -virtuals
 */
userSchema.pre("save", async function save(next){
    try{
        if(!this.isModified("password")) return next();

        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;

        return next();
    }catch(error){
        return next(error);
    }
});

/**
 * Methods
 */

userSchema.method({
    transform() {
        const transformed = {};
        const fields = ["id","email","role", "createdAt"];

        fields.forEach(field =>{
            transformed[field] = this[field];
        });
        return transformed;
    },

    async passwordMatches(password, hashPassword) {
        return bcrypt.compare(password,hashPassword);
    }
});

/**
 * @typedef user
 */

 module.exports = mongoose.model("user", userSchema, "users");
