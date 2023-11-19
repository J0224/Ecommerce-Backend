//Connect Server to MongoDB

const mongoose = require("mongoose");

const connectDB = async () =>{
  try{
      const connect = await mongoose.connect(process.env.MONGO_URI)

      console.log(`MongoDB Connected` )

  } catch (error){
 console.log(error)
 process.exit(1) // process.exitCode = 1;
  }
}

module.exports = connectDB