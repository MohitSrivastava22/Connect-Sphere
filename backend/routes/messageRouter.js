const express =require ('express')
const router=express.Router()
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, accessMessage } = require('../controller/messageController');

router.route('/:chatId').get(protect,accessMessage)
router.route('/').post(protect,sendMessage)

module.exports=router