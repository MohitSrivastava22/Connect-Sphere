import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Stack } from '@chakra-ui/layout'
import { Button, useToast, Text, Avatar } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/getSender';
import GroupChat from './GroupChat';
import axios from 'axios';





function MyChat({ fetchAgain }) {
  const { backendUrl, user,chats, setChats, selectedChat, setSelectedChat } = ChatState()
  const [loggedUser, setLoggedUser] = useState()
  const toast = useToast();

  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`
        }
      }
      const { data } = await axios.get(`${backendUrl}/api/chat/`, config)
      // console.log(data);
      setChats(data);
      // console.log("chats ", chats)
      // console.log("chats ", chats[0].user);
    } catch (error) {
      toast({
        title: "Error Occured!!",
        description: "Failed to Load the chats!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  // useEffect(() => {
  //   setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
  //   fetchChat();
  // }, [fetching])

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  useEffect(() => {
    if (loggedUser) {
      fetchChat();
    }
    // eslint-disable-next-line
  }, [fetchAgain, loggedUser]);
  
    // console.log("loggedUser ", loggedUser);
  

  return (
    // <>
    <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}

      borderRadius="lg"
      borderWidth="1px">
      <Box display="flex"
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center">
        My Chats
        <GroupChat>
          <Button
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChat>
      </Box>
      <Box
       display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto">
        {
          chats ? (
            <Stack>
              {chats.map((chat) => (
                <Box
                 onClick={() => setSelectedChat(chat)}
                  key={chat._id}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  w="100%"
                  height="90px"
                  borderRadius="lg">
                  <Box display="flex" alignItems="center" gap={3}>
                    {!chat.isGroup && loggedUser && chat.user ? (
                      <>
                        <Avatar
                          size="sm"
                          name={getSender(loggedUser, chat.user)}
                          src={
                            chat.user[0]._id === loggedUser._id ? chat.user[1]?.pic : chat.user[0]?.pic
                          }
                        />
                        <Text fontSize={{ base: "20px", md: "23px" }} fontFamily="Work sans">
                          {getSender(loggedUser, chat.user)}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Avatar size="sm" name={chat.chatName} src={chat.pic || ""} />
                        <Text fontSize={{ base: "20px", md: "23px" }} fontFamily="Work sans">
                          {chat.chatName}
                        </Text>
                      </>
                    )}
                  </Box>
                  
                  {/* <Text fontSize={{ base: "20px", md: "23px" }}
                    fontFamily="Work sans">
                    {
                      // console.log(chat.user),
                      
                      !chat.isGroup && loggedUser && chat.user ? (getSender(loggedUser, chat.user)) : (chat.chatName)

                    }
                  </Text> */}

                  {
                    chat.latestMessage && (
                      <Text ml={10}>
                        <b>{chat.latestMessage.sender.name}</b>
                        {chat.latestMessage.content.length > 50 ? (chat.latestMessage.content.substring(0, 51) + "...") : (chat.latestMessage.content)}
                      </Text>
                    )
                  }
                </Box>
              ))}
            </Stack>
          ) : (<ChatLoading />)
        }
      </Box>
    </Box>
    // </>
  )
}
export default MyChat









