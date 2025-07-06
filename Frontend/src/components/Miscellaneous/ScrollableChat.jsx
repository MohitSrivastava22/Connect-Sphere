import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isDifferentSender, isLastMessage, isSameSenderMargin, isSameUser } from '../../config/getSender'
import { ChatState } from '../../Context/ChatProvider'


function ScrollableChat({message}) {
  if (!message) {
    return <div>No messages yet!</div>;
  }
  if (message.length === 0) {
    return <div>No messages yet!</div>;
  }
  // if(!message){
  //   return
  // }
  const {user}=ChatState();
  // console.log("Messages:", message);
  // console.log("Current User:", user);
  return (
    <ScrollableFeed>
      {
        Array.isArray(message) &&
        message.map((m,i)=>(
          <div style={{ display: "flex" }} key={`${m._id}-${i}`}>
            {
              // console.log("Message:", m),
              
              m.sender &&(
                (isDifferentSender(message,m,i,user?.id))
                  ||(isLastMessage(message,i,user?.id))
                  &&(
                    <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                      <Avatar
                        mt="7px"
                        mr={1}
                        size="sm"
                        cursor="pointer"
                        name={m.sender.name}
                        src={m.sender.pic}
                      />
                    </Tooltip>
                  )
              )
            }

            <span style={{
              // backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              //   }`,
              backgroundColor: `${m.sender._id?.toString() === user.id?.toString() ? "#BEE3F8" : "#B9F5D0"}`,
              marginLeft: isSameSenderMargin(message, m, i, user.id),
              marginTop: isSameUser(message, m, i, user.id) ? 3 : 10,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}>
              {m.content}
            </span>
          </div>
        ))
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat
