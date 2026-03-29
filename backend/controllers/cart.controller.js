const Cart=require('../models/cart');
const Product=require('../models/products');

exports.addToCart = async (req, res) => {
    try{
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        if(product.stock<quantity){
            return res.status(400).json({message:"insufficient stock"});
        }
        
         let cart=await Cart.findOne({user:req.user.id});
         if(!cart)
         {
            cart = new Cart({
                user: req.user.id,
                items: [{ product: productId, quantity, price: product.price }]
            })
        }
        else {
            const existingItem = cart.items.find((item) => item.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            }
            else {
                cart.items.push({ product: productId, quantity, price: product.price });
            }
        }
         await cart.save();
         res.status(200).json({message:"item added to cart",cart});

    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.getCart=async(req,res)=>{
    try{
        const cart = await Cart.findOne({ user: req.user.id })
        .populate('items.product', 'name price image stock');
        if(!cart){
            return res.status(404).json({message:"cart not found"});
        }
        const cartTotal=cart.items.reduce((acc,item)=>acc+item.price*item.quantity,0);
        return res.status(200).json({message:"cart",cart,cartTotal});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.updateCart = async (req, res) => {
    try{
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "product not found" })
        }
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "cart not found" });
        }
        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: "item not found" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: "insufficient stock" });
        }
        item.quantity = quantity;
        await cart.save();
        return res.status(200).json({ message: "cart updated successfully", cart });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "cart not found" });
        }
        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: "item not found" });
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        return res.status(200).json({ message: "item removed from cart", cart });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "cart items not found" })
        }
        cart.items = [];
        await cart.save();
        return res.status(200).json({ message: "cart cleared successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}