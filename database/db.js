import mongoose from "mongoose";
import { env } from "../environment";

const connectMongoDB = async () => {
    console.log("to MongoDB.");
    const MONGODB_URI = process.env.MONGODB_URI || `mongodb+srv://${env.DB_USER_NAME}:${env.DB_PASSWORD}@cluster0.fbngfbs.mongodb.net/?retryWrites=true&w=majority`;
    if (!MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
    await mongoose.connect(MONGODB_URI, env.DB_NAME ? { dbName: env.DB_NAME } : undefined);
   var db= mongoose.connection
   db.on('error',console.error.bind(console,"DB connection error"))
   db.once('open',function(){
    console.log("successfully connected to db")
   })

};

export default connectMongoDB;
