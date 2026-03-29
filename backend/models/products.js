const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:3,
        maxlength:100,
        match:/^[a-zA-Z ]+$/
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxLength:1000
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    stock:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50,
        match:/^[a-zA-Z ]+$/
    },
    image:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50,
        match:/^[a-zA-Z ]+$/
    },featured:{
        type:Boolean,
        default:false
    }

    
    
},{timestamps:true});
module.exports=mongoose.model('Product',productSchema);