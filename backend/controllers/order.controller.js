const OrderModel=require('../models/orders');
const ProductModel=require('../models/products');
const cartModel=require('../models/cart');

exports.createOrder=async(req,res)=>{
    try{
        const cart=await cartModel.findOne({user:req.user.id});
        if(!cart||cart.items.length===0){
            return res.status(400).json({message:"cart is empty"});
        }
        for(const item of cart.items){
            const product=await ProductModel.findById(item.product);
            if(!product){
                return res.status(404).json({message:"product not found"});
            }
            if(product.stock<item.quantity){
                return res.status(400).json({message:"insufficient stock"});
            }
        }
        const totalAmount=cart.items.reduce((acc,item)=>acc+item.price*item.quantity,0);
        const order=new OrderModel({
            user:req.user.id,
            items:cart.items.map((item)=>{
                return{
                    product:item.product,
                    quantity:item.quantity,
                    price:item.price
                }
            }),
            totalAmount:totalAmount

        });
        await order.save();
        await cartModel.updateOne({user:req.user.id},{$set:{items:[]}});
        return res.status(201).json({message:"order created successfully",order});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.getMyOrders=async(req,res)=>{
    try{
        const orders=await OrderModel.find({user:req.user.id})
        .populate('items.product','name price image quantity')
        .sort({createdAt:-1});
        if(!orders||orders.length===0){
            return res.status(404).json({message:"no orders found"});
        }
        return res.status(200).json({message:"orders fetched successfully",orders});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.getOrder=async(req,res)=>{
    try{
        const order=await OrderModel.findById(req.params.id).
        populate('items.product','name price image quantity').
        populate('user','name email');
        if(!order){
            return res.status(404).json({message:"order not found"});
        }
        if(req.user.id !== order.user._id.toString() && req.user.role !== 'admin'){
            return res.status(403).json({message:"forbidden"});
        }
        return res.status(200).json({message:"order fetched successfully",order});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.getAllOrders=async (req, res) => {
  try {
    const orders=await OrderModel.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({createdAt:-1});

    res.json({ count:orders.length,orders});

  } catch (err) {
    res.status(500).json({message:err.message});
  }
};

exports.updateOrderStatus=async(req,res)=>{
  try {
    const {status}=req.body;

    const validStatuses=['pending','processing','delivered','cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'invalid status' });
    }

    const order=await OrderModel.findByIdAndUpdate(
      req.params.id,
      {status},
      {new:true}
    );

    if (!order) {
      return res.status(404).json({message:'order not found'});
    }

    res.json({
      message:'order updated successfully',
      order
    });

  }catch(err){
    res.status(500).json({message:err.message});
  }
};