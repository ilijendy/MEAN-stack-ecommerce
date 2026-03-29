const express=require('express');
const router=express.Router();
const {protect}=require('../middleware/auth.middleware');
const { addToCart, getCart, updateCart, removeFromCart, clearCart } = require('../controllers/cart.controller');

router.post('/addToCart',protect,addToCart);
router.get('/getCart',protect,getCart);
router.put('/updateCart',protect,updateCart);
router.delete('/removeFromCart/:productId',protect,removeFromCart);
router.delete('/clearCart',protect,clearCart);
module.exports=router;