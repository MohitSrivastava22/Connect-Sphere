const express=require('express')
const router=express.Router();
const { userRegistration, userLogin, allUser, searchUser } =require('../controller/userController')
const { protect } = require("../middleware/authMiddleware");
 
router.route('/registration').post(userRegistration)
router.route('/').get(protect,allUser)
router.route('/login').post(userLogin)
router.route('/search').get(protect, searchUser)
module.exports=router