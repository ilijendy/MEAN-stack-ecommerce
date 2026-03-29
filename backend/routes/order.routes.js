const express=require('express');
const router=express.Router();
const {protect,restrictTo}=require('../middleware/auth.middleware');
const {createOrder,getMyOrders,getOrder,getAllOrders,updateOrderStatus}=require('../controllers/order.controller');

router.post('/',protect,createOrder);
router.get('/myorders',protect,getMyOrders);
router.get('/',protect,restrictTo(['admin']),getAllOrders);
router.get('/:id',protect,getOrder);
router.put('/:id/status',protect,restrictTo(['admin']),updateOrderStatus);

module.exports=router;