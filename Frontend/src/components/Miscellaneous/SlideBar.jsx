import React, { useState,useEffect } from 'react'
import { Search2Icon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import { Text ,Input, Button, Menu, MenuButton, MenuItem, MenuList, Tooltip, MenuDivider, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/avatar'
import { ChatState } from '../../Context/ChatProvider'
import { useHistory } from 'react-router-dom'
import ChatLoading from './ChatLoading'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'
import ProfileModel from './ProfileModel'

function SlideBar() {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const { user, setUser, selectedChat, setSelectedChat,chats,setChats } = ChatState();
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
      const { data } = await axios.post(`/api/chat/`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data)
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


  const handleSearch = async () => {
    if (!search) {
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
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.get(`http://localhost:3000/api/user/search?search=${search}`, config);

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

  // useEffect to log searchResult when it changes
  useEffect(() => {
    console.log(searchResult);
  }, [searchResult]);


  // const handleSearch = async (searchTerm) => {
  //   try {
  //     // Make sure searchTerm is a string before fetching
  //     const response = await fetch(`http://localhost:3000/api/user/search?search=${encodeURIComponent(searchTerm)}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${user.token}`, // Include token if required
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const users = await response.json();
  //     console.log(users); // Check the response data
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //   }
  // };





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
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <BellIcon fontSize={28} marginRight={2} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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

      <Drawer size="xs" placement='left' onClose={onClose} isOpen={isOpen}>
        {/* <DrawerOverlay/> */}
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box d="flex">
              <Input w="77%" mr={2} placeholder='Search by name or email'
                value={search}
                onChange={(e) => { setSearch(e.target.value) }} />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (<ChatLoading />) : (
              searchResult?.map((user)=>(
                <UserListItem key={user._id} user={user} handlefunction={() => { accessChat(user._id)}}/>
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



















