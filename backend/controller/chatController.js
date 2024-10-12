const { path } = require('express/lib/application');
const Chat = require('../Models/chatModel');
const User = require('../Models/userModel')
const asyncHandler = require('express-async-handler')

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        console.log("UserId param not send with the user");
        return res.status(400);
    }

    // The $elemMatch operator matches documents that contain an array field with at least one element that matches all the specified query criteria.

    // The populate method in Mongoose is used to replace a field(in this case, references to another document) with the actual data from that referenced document.
    var isChat = Chat.find({
        isGroup: false,
        $and: [
            { user: { $elemMatch: { $eq: userId } } },
            { user: { $elemMatch: { $eq: req.user._id } } }
        ]
    }).populate("user", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroup: false,
            user: [userId, req.user._id]
        }
        try {
            const createChat = Chat.create(chatData)
            const fullChat = Chat.find({
                isGroup: false,
                and: [
                    { user: { $elemMatch: { $eq: req.user._id, userId } } }
                ]
            }).populate("user", "-password")
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

const fetchChat = asyncHandler(async (req, res) => {
    try {
        Chat.find({
            user: { $elemMatch: { $eq: req.user._id } }
        }).populate("user", "-password").populate("latestMessage").populate("groupAdmin", "-password").sort({ updatedAt: -1 }).then(async (result) => {
            result = await User.populate(result, {
                path: "latestmessage.sender",
                select: "name email pic isAdmin"
            })
            res.status(200).send(result)
        })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})


const createGroupChat = asyncHandler(async (req, res) => {

    if (!req.body.groupName || !req.body.participants) {
        res.send("Please provide GroupName ad Participants")
        return;
    }
    var participants = JSON.parse(req.body.participants)
    participants.push(req.user);
    if (participants.length < 2) {
        return res.status(400).send("More than two user is required to form a group")
    }
    try {
        const groupChat = await Chat.create({
            chatName: req.body.groupName,
            isGroup: true,
            groupAdmin: req.user,
            user: participants,
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("user", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

const renameGroup=asyncHandler(async (req , res)=>{
    try{
        const { rename, groupId } = req.body
        const updatedGroup = await Chat.findByIdAndUpdate(groupId, { chatName: rename }, { new: true }).populate("user", "-password").populate("groupAdmin", "-password").populate("latestMessage")
        if (!updatedGroup) {
            res.status(400).send("Group doesn't exist")
            return;
        }

        res.status(200).send(updatedGroup)

    }catch(error){
        res.status(500).send(error.message);
    }
})

const addToGroup=asyncHandler(async(req,res)=>{
    try{
        const { groupId, userId } = req.body
        const addUser = await Chat.findByIdAndUpdate(groupId, { $push: { user: userId } }, { new: true }).populate("user", "-password").populate("groupAdmin", "-password")
        if (!addUser) {
            return res.status(400).send("Enter valid group")
        }
        res.json(addUser);
    }catch(error){
        res.status(400).send(error.message)
    }
})

const removeFromGroup= asyncHandler(async(req,res)=>{
    try{
        const { groupId, userId } = req.body
        const deleteUser = await Chat.findByIdAndUpdate(groupId, { $pull: { user: userId } }, { new: true }).populate("user", "-password").populate("groupAdmin", "-password")
        if (!deleteUser) {
            return res.status(400).send("Enter valid group")
        }
        res.json(deleteUser);
    }catch(error){
        res.status(400).send(error.message)
    }
})

module.exports = { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup }