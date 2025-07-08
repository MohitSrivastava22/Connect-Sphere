import React, { useState,useEffect } from 'react'
import { Search2Icon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import { Text ,Input, Button, Menu, MenuButton, MenuItem, MenuList, Tooltip, MenuDivider, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerOverlay, useDisclosure, useToast } from '@chakra-ui/react'
// import { Avatar } from '@chakra-ui/avatar'
import { Avatar } from "@chakra-ui/react";
import { ChatState } from '../../Context/ChatProvider'
import { useHistory } from 'react-router-dom'
import ChatLoading from './ChatLoading'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'
import ProfileModel from './ProfileModel'
import { getSender } from '../../config/getSender'
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
import { use } from 'react'

function SlideBar() {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const { backendUrl, user, setUser, selectedChat, setSelectedChat,chats,setChats,notification, setNotification } = ChatState();
  const history = useHistory();
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast=useToast();

  
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push('/')
  }

  const accessChat = async (userId) => {
    try{
      const config={
        headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${user.token}`
        }
      }
      console.log("userId being sent:", userId);
      const { data } = await axios.post(`${backendUrl}/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data)
      resetInput();
      onClose();
    }catch(error){
      setLoading(false);
      toast({
        title: "Error in fetching the chat",
        discription: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return
    }
  }


  const handleSearch = async (query) => {

    if (!query || query.trim() === "") {
      toast({
        title: "Please Search The User",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setSearch(query);
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.get(`${backendUrl}/api/user/search?search=${search}`, config);

      if (Array.isArray(data)) {
        setSearchResult(data);
      } else {
        setSearchResult([]);
      }

      setLoading(false);

    } catch (error) {
      toast({
        title: "Error Occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    if(!search.trim()){
      return
    }
    handleSearch(search);
  }, [search])
  

  // useEffect to log searchResult when it changes
  // useEffect(() => {
  //   // console.log(searchResult);
  // }, [searchResult]);


  useEffect(() => {
    setNotification(notification.filter((n) => n.chat._id !== selectedChat._id))
  }, [selectedChat]);

  const resetInput = () => {
    setSearch("");
    setSearchResult([]);
  }


  return (
    <>
      <Box bg="white" w="100%" display="flex" justifyContent="space-between" alignItems="center" p="5px 10px 5px 10px">
        <Tooltip hasArrow label="Search User to chat">
          <Button variant="ghost" onClick={onOpen}>
            <Search2Icon fontSize={18} marginRight={2} marginLeft={-2} />
            <Text display={{ base: "none", md: "flex" }} fontSize={18}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="4xl">
          Connect Sphere
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu>
            <MenuButton>
              {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={28} marginRight={2} /> */}
            </MenuButton>
            <MenuList>
              {!notification.length && "No New Messages"}
              {notification?.length > 0 && notification.map((notifi,idx)=>(
                // console.log("Notification:", notifi),
                
                <MenuItem key={notifi._id + '-' + idx}
                onClick={()=>{
                  setSelectedChat(notifi.chat);
                  setNotification(notification.filter((n)=> n.chat._id!==notifi.chat._id))
                }}>
                {
                notifi?.chat.isGroup ? (`New Message in ${notifi.chat.chatName}`):(getSender(user, notifi.chat.user))}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} ml={4}>
              {user && (
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
              )}
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}> 
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer size="xs" placement='left' onClose={() => { onClose(); resetInput()}} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex">
              <Input w="77%" mr={2} placeholder='Search by name or email'
                value={search}
                onChange={e => setSearch(e.target.value)} />
              <Button onClick={()=>handleSearch(search)}>Go</Button>
            </Box>
            {loading ? (<ChatLoading />) : (
              searchResult?.map((user)=>(
                <UserListItem key={user._id} user={user} handleFunction={() => { accessChat(user._id)}}/>
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SlideBar



















