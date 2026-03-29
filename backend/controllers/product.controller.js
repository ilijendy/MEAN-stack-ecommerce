const Product=require('../models/products');
exports.createProduct=async(req,res)=>{
    try{
        const product=req.body;
        const productExists=await Product.findOne({name:product.name});
        if(productExists){
            return res.status(400).json({message:"product already exists"});
        }
        const savedProduct=await Product.create(product);
        return res.status(201).json({message:"product created successfully",data:savedProduct});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.getAllProducts=async (req,res)=>{
    try{
        const products=await Product.find();
        return res.status(200).json({message:"products fetched successfully",count:products.length,data:products});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.getProductById=async (req,res)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    if(!product){
        return res.status(404).json({message:"product not found"});
    }
    return res.json({message:"product fetched successfully",data:product});

}
exports.updateProducts=async(req,res)=>{
    try{
        const {id}=req.params;
        const currentProduct=req.body;
        const updatedProduct=await Product.findByIdAndUpdate(id,currentProduct,{new:true});
        if(!updatedProduct){
            return res.status(404).json({message:"product not found"});
        }
        return res.status(200).json({message:"product updated successfully",data:updatedProduct});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.deleteProduct=async(req,res)=>{
    try{
        const {id}=req.params;
        const deletedProduct=await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(404).json({message:"product not found"});
        }
        return res.status(200).json({message:"product deleted successfully",data:deletedProduct});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.searchProducts=async(req,res)=>{
    const {product}=req.query;
    if(!product){
        return res.status(400).json({message:"Notfound"});
    }
    const products=await Product.find({
        name:{$regex:product,$options:'i'}
    });
    if(!products){
        return res.status(404).json({message:"products not found"});
    }
    return res.status(200).json({message:"products fetched successfully",count:products.length,data:products});
}
exports.filterProductByCategory=(req,res)=>{
    try{
        const {category}=req.query;
        if(!category){
            return res.status(400).json({message:"category is required"});
        }
        const products= Product.find({category});
        if(!products){
            return res.status(404).json({message:"products not found"});
        }
        return res.status(200).json({message:"products fetched successfully",count:products.length,data:products});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
