import React from 'react'
// import { Box } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { ChatState } from '../Context/ChatProvider'
import ChatBox from '../components/Miscellaneous/ChatBox'
 import SlideBar from '../components/Miscellaneous/SlideBar'
 import MyChat from '../components/Miscellaneous/MyChat'
import { Box } from '@chakra-ui/layout'


function ChatPage() {
  const{user}=ChatState();
  return (
    <>
      <div>
        {<SlideBar />}
        <Box>
          {user && <MyChat />}
          {/* {<ChatBox/>} */}
        </Box>
      </div>
  </>
  )
}

export default ChatPage
