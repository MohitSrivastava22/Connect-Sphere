export const getSender= (loggedUser,user)=>{
    if (!user || user.length < 2) {
        return ''; // or handle this case appropriately
    }
    return user[0]._id==loggedUser._id?(user[1].name):(user[0].name)
}