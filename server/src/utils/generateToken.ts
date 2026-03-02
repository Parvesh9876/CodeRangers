import jwt from "jsonwebtoken";
import { error } from "node:console";
const generateToken=(id:string): string=>{
    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new Error("JWT_SECRET not Defined");
    }
    return jwt.sign({id},secret,{
        expiresIn:"7d",
    });
};

export default generateToken;