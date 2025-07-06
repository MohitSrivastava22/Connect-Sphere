const asyncHandler = require('express-async-handler')
const Message=require ('../Models/messageModel')
const Chat=require('../Models/chatModel')
const User = require('../Models/userModel')


// const accessMessage=asyncHandler(async(req,res)=>{
//     // const {chatId}=req.params
//     // console.log("Chat ID:", chatId);
    
//     // if(!chatId){
//     //     return res.send("Provide paramms")
//     // }
//     try {
//         const { data } = await Message.find({ chat: req.params.chatId}).populate("sender","name pic email").populate("chat")
//         console.log(data)
//         res.json(data)
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// })
const accessMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
  
const sendMessage = asyncHandler(async (req, res) => {
    const { content , chatId} = req.body;

    if (!chatId || !content) {
        return res.status(400).send("chatId or content is not present");
    }

    try {
        var newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
        };

        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")

        message = await User.populate(message, {
            path: "chat.user",
            select: "name pic email"
        });

        // Update the latest message in the chat
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        }, { new: true });
        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


module.exports = { accessMessage, sendMessage }






