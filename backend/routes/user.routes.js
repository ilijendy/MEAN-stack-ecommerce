const express=require('express');
const router=express.router;
const {getProfile,updateProfile}=require('../controllers/user.controller');
const {protect,restrictTo}=require('../middleware/auth.middleware');

router.get('/profile',protect,restrictTo(['user','admin']));
router.put('/profile',protect,restrictTo(['user','admin']));

module.exports=router;

