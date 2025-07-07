import React, { useState } from 'react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, IconButton, Box, FormControl, Spinner, useDisclosure, Input, useToast } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadge from '../userAvatar/UserBadge';
import UserListItem from '../userAvatar/UserListItem';
import { ViewIcon } from '@chakra-ui/icons';
import axios from 'axios';

function UpdateGroupChatModel({ fetchAgain, setFetchAgain, fetchMessage }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { backendUrl,user, selectedChat, setSelectedChat } = ChatState();
    const [groupName, setGroupName] = useState("");
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove = async (removeUser) => {
        console.log("Admin ID:", selectedChat.groupAdmin._id);
        console.log("Logged-in User ID:", user.id);
        console.log("User to be removed ID:", removeUser._id);
        if (selectedChat.groupAdmin._id!== user.id && user.id !== removeUser._id) {
            toast({         
                title: "Only Admin can remove",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`${backendUrl}/api/chat/removeFromGroup`, {
                groupId: selectedChat._id,
                userId: removeUser._id,
            }, config);

            user.id === removeUser._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            fetchMessage();
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };



    const leaveGroup = async (removeUser) => {
        if (selectedChat.groupAdmin._id !== user.id && user.id !== removeUser.id) {
            toast({
                title: "Only Admin can remove",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`${backendUrl}/api/chat/removeFromGroup`, {
                groupId: selectedChat._id,
                userId: removeUser.id,
            }, config);

            user.id === removeUser.id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            fetchMessage();
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${backendUrl}/api/user/search?search=${query}`, config);
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    const renameGroup = async () => {
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`${backendUrl}/api/chat/renameGroup`, {
                rename: groupName,
                groupId: selectedChat._id,
            }, config);

            setSelectedChat(data);
            setRenameLoading(false);
            setFetchAgain(!fetchAgain);
            setGroupName("");
            setSearch("");
            
        } catch (error) {
            toast({
                title: "Error Occurred!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupName("");
    };
    // console.log("searchResult:", searchResult);
    // console.log("selectedChat:", selectedChat);
    

    const handleAddUser = async (member) => {
        console.log("memberF:", member);
        if (!member) return;
        
        // console.log("Logged-in user.id:", user.id);
        // console.log("Group admin._id:", selectedChat.groupAdmin._id);



        if (selectedChat.user.find((u) => u._id?.toString() === member._id.toString())) {
            toast({
                title: "User already exists",
                status: "info",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (user.id.toString() !== selectedChat.groupAdmin._id.toString()) {
            toast({
                title: "Only admin can add someone",
                status: "info",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`${backendUrl}/api/chat/addToGroup`, {
                groupId: selectedChat._id,
                userId: member._id,
            }, config);
            console.log("dataaaaa:", data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const resetInput = () => {
        setGroupName("");
        setSearch("");
        setSearchResult([]);
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={()=>{onClose(); resetInput()}} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.user.map((x,idx) => (
                                <UserBadge key={`x._id-${idx}`} user={x} handleFunction={() => handleRemove(x)} />
                            ))}
                        </Box>

                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={renameGroup}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add User to group" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult.map((user,idx) => (
                                <UserListItem key={`user._id-${idx}`} user={user} handleFunction={() => handleAddUser(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button onClick={() => leaveGroup(user)}  variant="ghost">Leave</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateGroupChatModel;
