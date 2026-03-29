const express=require('express');
const router=express.Router();
const {getProfile,updateProfile}=require('../controllers/user.controller');
const {protect,restrictTo}=require('../middleware/auth.middleware');

router.get('/profile',protect,restrictTo(['user','admin']),getProfile);
router.put('/profile',protect,restrictTo(['user','admin']),updateProfile);

module.exports=router;

