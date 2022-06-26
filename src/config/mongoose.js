const mongoose = require("mongoose");
const {mongo,env} = require("./vars");

//set mongoose Promise to Bluebird
mongoose.Promise = Promise;

//Exit application on error
mongoose.connection.on("error", (err)=>{
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

// print mongoose logs in dev env
if(env === "development") {
    mongoose.set("debug", true);
}

mongoose.connection.on("disconnected",()=>{
    console.log("Lost MongoDB connection...")
});

mongoose.connection.on("reconnected",()=>{
    console.log("Reconnected to MongoDB");
})

/**
 * Connect to mongo db
 * 
 * @returns {object} Mongoose connection
 * @public
 */

 const options = {
     keepAlive:true,
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true,
     useFindAndModify: false
 }

 exports.connect = ()=>{
     mongoose.connect(mongo.uri,options, ()=>{
         console.log("Mongodb server connected...");
     });
     return mongoose.connection;
 }