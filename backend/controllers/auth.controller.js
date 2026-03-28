const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const User=require('../models/user');

exports.register=async(req,res)=>{
    try{
        const {name,email,password,role}=req.body;
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"user already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const savedUser=await User.create({name,email,password:hashedPassword,role:role||"user"});
        const token=jwt.sign({id:savedUser.id,role:savedUser.role},process.env.JWT_SECRET,{expiresIn:"3d"});
        res.status(201).json({ message:"user created successfully",data:savedUser,token});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.Login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        const isMatchedPassword=await bcrypt.compare(password,user.password);
        if(!isMatchedPassword){
            return res.status(400).json({message:"invalid password"})
        }
        const token=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:"3d"});
        res.status(200).json({message:"user logged in successfully",data:user,token});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}