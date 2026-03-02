import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User,{IUser} from "../models/User";

interface AuthRequest extends Request{
    user?: IUser;
}
const protect =async(
    req:AuthRequest,
    res:Response,
    next:NextFunction
): Promise<void> =>{
    try{
        let token :string | undefined;
        if(
            req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")
        ){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token){
            res.status(401).json({message : "Not authorized No token"});
            return;
        }
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET as string)as{id: string};

        const user =await User.findById(decoded.id).select("-password");

        if(!user){
            res.status(401).json({message :"User Not Found"});
            return;
        }
        req.user=user;
        next();
    }catch(error){
        res.status(401).json({message : "Token Failed"});
    }
};

export {protect, AuthRequest};