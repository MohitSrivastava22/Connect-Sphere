const mongoose=require('mongoose')

const chatSchema=mongoose.Schema({
    chatName:{type:"String",trim:true},
    isGroup:{type:Boolean,default:false},
    groupAdmin:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    latestMessage:{type:mongoose.Schema.Types.ObjectId,ref:"Message"},
    user:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
},{timestamps:true})

const Chat = mongoose.model("Chat", chatSchema)
module.exports=Chat
