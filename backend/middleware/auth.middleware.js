const jwt=require('jsonwebtoken');
exports.protect=async(req,res,next)=>{
    try{
        const token=await req.headers.authorization;
        if(!token){
            return res.status(401).json('unauthorized');
        }
        const decodedToken=await jwt.verify(token,process.env.JJWT_SECRET);
        req.user=decodedToken;
        next();
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.restrictTo=(roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json("forbidden");
        }
        next();
    }
}