const express=require('express');
const router=express.Router();
const productController=require('../controllers/product.controller');
const {protect,restrictTo}=require('../middleware/auth.middleware');

router.post('/',protect,restrictTo(['admin']),productController.createProduct);
router.get('/search',productController.searchProducts);
router.get('/filter',productController.filterProductByCategory);
router.get('/',productController.getAllProducts);
router.get('/:id',productController.getProductById);
router.put('/:id',protect,restrictTo(['admin']),productController.updateProducts);
router.delete('/:id',protect,restrictTo(['admin']),productController.deleteProduct);
module.exports=router;
