import { createContext, useContext,useState,useEffect } from "react";
import {useHistory} from 'react-router'

const ChatContext = createContext();

const ChatProvider=({children})=>{
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
         if (userInfo) {
            setUser(userInfo);  // If user exists, set user
        } else {
            history.push('/');   // Redirect to login if not found
        }
    }, [history])
    
    
    return(
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>{children}</ChatContext.Provider>
    )
}
export const ChatState=()=>{
   return useContext(ChatContext)
}
export default ChatProvider;



//  // The children prop is an object that contains the child elements that are wrapped by the ChatProvider component.When you use the ChatProvider component in your application, you would typically wrap your app or a specific section of your app with it




