const mongoose=require('mongoose');
const cartSechema=new mongoose.Schema({
    user:{
        Types:mongoose.Schema.Types.ObjectId,
        ref:user,
        required:true
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:products,
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                min:1
            }
        }
    ]
    
},{timestamps:true});

module.export=mongoose.model('cart',"cartSchema");