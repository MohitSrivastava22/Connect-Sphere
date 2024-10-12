const asyncHandler = require("express-async-handler");
const User = require('../Models/userModel')
const generateToken = require('../config/generateToken')


const userRegistration = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please Enter All The Field");
    }
    const userExist = await User.findOne({ email })  
 
    
    if (userExist) {
        res.status(400)
        throw new Error("User Already Exist")
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        throw new Error("User not found")
    }
})

const userLogin =asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user){
        throw new Error("User not Found")
    }
    if(await user.matchPassword(password)){
        res.json({
            id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        })
    }else{
        throw new Error("Invalid Email or Password")
    }
})

const allUser=asyncHandler(async (req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {name:{regex:req.query.search,option:"i"}},
            {email:{regex:req.query.search,option:"i"}}
        ]
    }:{}
    const user=await User.find(keyword).find({_id:{$ne: req.user._id}})
    res.send(user);
})

const searchUser = asyncHandler(async (req, res) => {
    const searchQuery = req.query.search;
    if (!searchQuery) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        res.json(users);
    } catch (error) {
        console.error("Error searching for users:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = { userRegistration, userLogin, allUser, searchUser }



// JSON.parse() method is used to parse a JSON string and convert it into a JavaScript object.