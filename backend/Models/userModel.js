const mongoose=require ('mongoose')
const bcrypt = require("bcryptjs");

const userSchema= mongoose.Schema({
    name:{type: "String",required:true},
    email:{type:"String",required:true,unique:true},
    password:{type:"String",required:true},
    pic:{
        type:"String",
        required:true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
},{timestamps:true})

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})


const User = mongoose.model("User", userSchema)
module.exports= User














// When the password hasn't changed: If a user updates other fields in their profile (e.g., their name or email) without changing their password, there's no need to re - hash the password.Hashing is an expensive operation, so we want to avoid doing it unnecessarily.
// When the password has changed: Only in this case should the password be re - hashed to ensure that the stored password remains secure

// Salt: A salt is a random string of data that is added to the password before hashing.The purpose of the salt is to ensure that even if two users have the same password, their hashed passwords will be different due to the unique salt added to each.