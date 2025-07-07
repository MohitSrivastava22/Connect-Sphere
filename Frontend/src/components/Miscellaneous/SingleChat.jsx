import React, { useEffect, useRef, useState } from 'react'
import { FormControl, IconButton, Input, Spinner } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider'
import { Box, Text } from '@chakra-ui/layout'
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useToast } from '@chakra-ui/react'
import { getSender } from '../../config/getSender'
import { getSenderFull } from '../../config/getSender';
import ProfileModel from './ProfileModel';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import "../../style.css"
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;
var selectedChatCompare;    

function SingleChat({ fetchAgain, setFetchAgain }) {
    const socket = useRef();

    const { backendUrl, user, selectedChat, setSelectedChat, notification,setNotification } = ChatState()
    const toast = useToast();
    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)



    useEffect(() => {
        if (!user) return;
        socket.current = io(ENDPOINT);
        socket.current.emit("setup", user);
        socket.current.on("typing", () => setIsTyping(true));
        socket.current.on("stop typing", () => setIsTyping(false));
        socket.current.on("connected", () => setSocketConnected(true));
    }, [user]);



    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");

                const { data } = await axios.post(`${backendUrl}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                // console.log(data);
                

                // setNewMessage("");
                socket.current.emit("new message", data);
                setMessage([...message, data]);
                

            } catch (error) {
                console.error("Error sending message:", error);

                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the message.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    useEffect(() => {

        fetchMessage()
        if (!selectedChat || !socket.current) return;
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    
    // useEffect(() => {
    //     console.log("notification is ", notification);
    // }, [notification]);


    
    useEffect(() => {
        if (!socket.current) return;

        const handleMessageReceived = (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.some(n => n._id === newMessageReceived._id)) {
                    setNotification([...notification, newMessageReceived]);
                    setFetchAgain(f => !f);
                }
            } else {
                setMessage(prevMessages => [...prevMessages, newMessageReceived]);
            }
        };

        socket.current.on("message received", handleMessageReceived);

        // Cleanup to prevent duplicate listeners
        return () => {
            socket.current.off("message received", handleMessageReceived);
        };
    }, [notification, setNotification, setFetchAgain, selectedChat]);
    

 
    useEffect(() => {
        if (!selectedChat || !user) return;
        socket.current.emit("join chat", selectedChat._id);
    }, [selectedChat, user]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value)


        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.current.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.current.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    const fetchMessage = async () => {
        if (!selectedChat) return
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`${backendUrl}/api/message/${selectedChat._id}`, config)
            
            // console.log(data)
            setMessage(data);
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the Message",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return
        }
    }


    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            d="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {message && (!selectedChat.isGroup ? (
                                <>
                                    {getSender(user, selectedChat.user)}
                                    <ProfileModel user={getSenderFull(user, selectedChat.user)} />
                                </>
                            )
                                : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModel
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                            fetchMessage={fetchMessage} />
                                    </>
                                ))}
                        </Text>
                        <Box display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="auto"
                            flex="1 1 0%"
                            minHeight={0}>
                            {loading ? (<Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />) : (
                                   
                                        <Box style={{marginBottom:"auto", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} className='messages'
                                            w="100%"
                                            h="100%"
                                            bg="#F8F8F8"
                                            borderRadius="lg"
                                            overflowY="auto" // or "hidden" if using ScrollableFeed
                                            p={3}
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="flex-end"
                                            flex="1"
                                            minHeight={0}>
                                        <div className="flex flex-col overflow-y-scroll scrollbar-none">
                                            <ScrollableChat message={message} />
                                        </div>

                                        </Box>
                            )}
                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                {isTyping ? (
                                    <div className="typing-indicator">
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <Input variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message.."
                                    value={newMessage} onChange={typingHandler} />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text >
                    </Box >
                )
            }
        </>
    )
}

export default SingleChat




