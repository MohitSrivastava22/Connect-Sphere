export const getSender = (loggedUser, user) => {
    if (!user || user.length < 2) {
        console.log("User array is either empty or less than 2 elements", user);
        return // Return 'Unknown' to indicate missing sender data
    }
    return user[0]._id === loggedUser.id ? user[1].name : user[0].name;
};


export const getSenderFull = (loggedUser, user) => {
    if (!user || user.length < 2) {
        console.log("User array is either empty or less than 2 elements", user);
        return // Return 'Unknown' to indicate missing sender data
    }
    return user[0]._id === loggedUser._id ? user[1] : user[0];
};




export const isDifferentSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};


export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
  };


export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
  };

  
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };