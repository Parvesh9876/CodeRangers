import mongoose from "mongoose";
import { log } from "node:console";
const connectDB=async () : Promise<void>=>{
    try{

        const mongoUri:string | undefined =process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI not defined in .env");
    }
        const conn=await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDb Connected : ${conn.connection.host}`);

        
    }catch(error:unknown){
        if(error instanceof Error){
            console.error(error.message);
        }
        process.exit(1);

        
        
    }
};
export default connectDB;