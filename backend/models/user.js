const mongoose = require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxLength:50,
        match: /^[a-zA-Z ]+$/
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:128
    },
    role :{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
  
},
   {timestamps:true});

module.exports=mongoose.model('User',userSchema);

