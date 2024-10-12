import React, { useState } from 'react'
import axios from 'axios';
import { useToast,Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, useDisclosure } from '@chakra-ui/react'
import {FormControl,FormLabel} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import ChatLoading from './ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import UserBadge from '../userAvatar/UserBadge';
import { Box } from '@chakra-ui/react';

function GroupChat({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [GroupChatName, setGroupChatName] = useState("")
    const [selectedMember, setSelectedMember] = useState([])
    const [loading, setLoading] = useState(false)
    const [search , setSearch]=useState("");
    const [searchResult, setSearchResult] = useState([]);
    const toast=useToast();
    const { user, chats, setChats } = ChatState();


    const handleSearch = async (member)=>{
        setSearch(member);
        if (!member){
            return ;
        }
       try{
        setLoading(true)
        const config={
            headers :{
                Authorization : `Bearer ${user.token}`
            }
        }
           const { data } = await axios.get(`http://localhost:3000/api/user/search?search=${member}`, config)
           console.log(data);
           setLoading(false)
           setSearchResult(data);
           
       }catch(error){
           toast({
               title: "Error Occured",
               description:"Failed to load the Search Result",
               status: "warning",
               duration: 5000,
               isClosable: true,
               position: "top-left",
           });
           
       }
    }

    const handleGroup = (user)=>{
        if(selectedMember.includes(user._id)){
            toast({
                title: "User Already Exist",
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top-left",
            });
            return 
        }
        setSelectedMember([...selectedMember, user])

    }


    const handleCreateGroup =async()=>{
        if(!GroupChatName||!selectedMember){
            toast({
                title: "Please fill all the feilds",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-left",
            });
            return 
        }

        try {
            const config={
                headers:{
                   
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.post(`http://localhost:3000/api/chat/createGroupChat`,{
                name:GroupChatName,
                members:JSON.stringify(selectedMember.map((s)=>(s._id)))
            }, config)
            setChats([data, ...chats]); 
            onClose()
        } catch (error) {
            toast({
                title: "Error Occured",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-left",
            });
            return 
        }
    }

    const deleteMember=(deleteUser)=>{
        setSelectedMember(selectedMember.filter((selected)=> selected._id!=deleteUser._id))
    }


  return (
    <>
          <span onClick={onOpen}>{children}</span>

          <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader>Create Group</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                      <FormControl>
                          <FormLabel>Group Chat Name</FormLabel>
                          <Input required type='name' value={GroupChatName} onChange={(e)=>setGroupChatName(e.target.value)} />
                          <FormLabel>Add User to the  Group</FormLabel>
                          <Input mb={1} type='name' value={search} onChange={(e)=>handleSearch(e.target.value)}/>
                          
                      </FormControl>
                      {loading?(<ChatLoading/>):(
                          searchResult.map((userr)=>(
                            <UserListItem key={userr._id} user={userr} handlefunction={()=>handleGroup(userr)}/>
                          ))
                      )}

                      <Box w="100%" d="flex" flexWrap="wrap">
                          {
                              selectedMember.map((singleMember) => (
                                  <UserBadge key={singleMember._id} user={singleMember} handleFunction={()=>deleteMember(singleMember)} />
                              ))
                          }
                      </Box>
                  </ModalBody>

                  <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={handleCreateGroup}>
                          Create Group
                      </Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>
    </>
  )
}

export default GroupChat
