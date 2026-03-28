const User=require('../models/user');

exports.getProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(404).json("user not found");
        }
        return res.status(200).json({message:"user profile",data:user});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.updateProfile=async(req,res)=>{
    try{
        const {name,email}=req.body;
        const userId=req.user.id;
    if (email) {
      const emailExists = await User.findOne({
        email: email,
        _id: { $ne: userId } 
      });
      if(emailExists){
        return res.status(400).json({message:"email already exists"});
      }
    }
    const updatedUser=await User.findByIdAndUpdate(userId,req.body,{new:true});
    return res.status(200).json({message:"user updated successfully",data:updatedUser});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}