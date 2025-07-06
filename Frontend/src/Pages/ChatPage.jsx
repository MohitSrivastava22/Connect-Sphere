import React, { useState } from 'react'
import { Search2Icon } from '@chakra-ui/icons'
import { ChatState } from '../Context/ChatProvider'
import ChatBox from '../components/Miscellaneous/ChatBox'
 import SlideBar from '../components/Miscellaneous/SlideBar'
 import MyChat from '../components/Miscellaneous/MyChat'
import { Box } from '@chakra-ui/layout'


function ChatPage() {
  const{user}=ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <>
      <div style={{ width: "100%" }}>
        {<SlideBar />}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px"> 
          {user && <MyChat fetchAgain={fetchAgain} />}
          {<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
      </div>
  </>
  )
}

export default ChatPage
