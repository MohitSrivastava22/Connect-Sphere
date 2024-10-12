const express = require('express')
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup }=require('../controller/chatController')

const router=express.Router();

router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchChat)
router.route('/createGroupChat').post(protect, createGroupChat)
router.route('/renameGroup').put(protect, renameGroup)
router.route('/addToGroup').put(protect, addToGroup)
router.route('/removeFromGroup').put(protect, removeFromGroup)
// router.route('/removeGroup').put(protect, removeGroup)

module.exports=router
