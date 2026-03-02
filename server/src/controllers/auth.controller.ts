import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User"
import generateToken from "../utils/generateToken";

//Register
export const registerUser=async(
    req:Request,
    res:Response
): Promise<void>=>{
    try{
        console.log("Enter in Register");
        
        const {name,email,password} =req.body;
        console.log(name);
        
        const userExists=await User.findOne({email});
        if(userExists){
            res.status(400).json({
                message: "User already Exists"
            });
            return ;
        }
        const salt =await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);
        const user=await User.create({
            name,
            email,
            password :hashedPassword,
        });
        res.status(201).json({
            token: generateToken(String(user._id)),
            user,
        });
    }catch(error){
        console.log(error);
        
        res.status(500).json({message : "Server Error"});
    }
};

//Login

export const loginUser=async(
    req:Request,
    res:Response
):Promise<void>=>{
    try{
        const {email,password}=req.body;
        const user =await User.findOne({email});
        if(!user){
            res.status(400).json({
                message:"User Not Found"
            });
            return;
        }
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({
                message: "Invalid Credentials"
            });
            return;
        }

        res.json({
            token:generateToken(user._id.toString()),
            message: "Login SuccesFully",
        });
    }catch{
        res.status(500).json({
            message: "Server Error"
        });
    }
};