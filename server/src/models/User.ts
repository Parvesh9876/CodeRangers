import mongoose,{Document, Schema} from "mongoose";
export interface IUser extends Document{
    name:String;
    email : string;
    password : string;
    role: "user" | "admin";
}

//Schema
const UserSchema : Schema<IUser> =new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:["user", "admin"],
            default:"user",
        }

    },
    {timestamps:true}

);

export default mongoose.model<IUser>("User",UserSchema);