import React, {useEffect,useState} from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Stack } from '@chakra-ui/layout'
import { Button,useToast,Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/getSender';
import GroupChat from './GroupChat';



function MyChat({fetching}) {
  const {chats ,setChat,selectedChat}=ChatState()
  const [loggedUser, setLoggedUser] = useState()
  const toast =useToast();

  const fetchChat=async ()=>{
    try{
      const config = {
        header: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.post('/api/chat', config)
      setChat(data);
    }catch(error){
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChat();
  }, [fetching])
  
  return (
    <>
      <Box d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px">
        <Box pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          d="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center">
        My Chats
          <GroupChat>
            <Button d="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}>
              New Group Chat
            </Button>
          </GroupChat>
      </Box>
      <Box>
        {
          chats? (
            // <Stack>
            //   {chats.map((chat)=>(
            //     <Box onClick={()=> setSelectedChat(chat)}
            //     key={chat._id}
            //       cursor="pointer"
            //       bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
            //       color={selectedChat === chat ? "white" : "black"}
            //       px={3}
            //       py={2}
            //       borderRadius="lg">

            //         <Text>
            //           {
            //             !chat.isGroup?(getSender(loggedUser,chat.user)):(chat.chatName)
            //           }
            //         </Text>

            //     </Box>
            //   ))}
            // </Stack>


              <Stack>
                {chats.map((chat) => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    key={chat._id} // This key is important
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                  >
                    <Text>
                      {!chat.isGroup ? getSender(loggedUser, chat.user) : chat.chatName}
                    </Text>
                  </Box>
                ))}
              </Stack>

          ):(<ChatLoading/>)
        }
      </Box>
    </Box>
    </>
  )
}

export default MyChat
