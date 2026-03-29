const jwt=require('jsonwebtoken');
exports.protect=async(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        if(token && token.startsWith('Bearer ')){
            token = token.split(' ')[1];
        }
        if(!token){
            return res.status(401).json('unauthorized');
        }
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
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