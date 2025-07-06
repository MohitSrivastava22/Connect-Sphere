// import { useDisclosure } from '@chakra-ui/react'
// import { ViewIcon } from '@chakra-ui/icons'
// import React from 'react'
// import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,IconButton } from '@chakra-ui/react'
// import { Image,Text } from '@chakra-ui/react'

// const  ProfileModel=({user,children})=> {
//   const { isOpen, onOpen, onClose } = useDisclosure()

//   if (!user) {
//     return null; // Or a loading spinner if you prefer
//   }
//  const updateProfile = () => {
    
//  }

  
//   return (
//     <>
      
//       {children ? (
//         <span onClick={onOpen}>{children}</span>
//       ) : (
//         <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
//       )}
//       <Modal size="lg"  isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent h="410px">
//           <ModalHeader 
//           fontSize="40px"
//           fontFamily="Work sans"
//           display="flex"
//           justifyContent= "center"          
//           >{user.name}</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody display="flex" flexDir="column" alignItems="center">
//             <Image
//             borderRadius="full"
//               boxSize='150px'
//               src={user.pic}
//               alt={user.name}
//               // isCentered
//             />
//             <Text fontSize={{base: "28px",md:"30px"}}
//             fontFamily="Work san"
//             display="flex"
//             justifyContent="center"
//             >
//               Email: {user.email}
//             </Text>
//           </ModalBody>

//           <ModalFooter>
//             <Button colorScheme='blue' mr={3} onClick={onClose}>
//               Close
//             </Button>
//             <Button onClick={updateProfile} colorScheme='blue' mr={3}>
//               Update
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   )
// }

// export default ProfileModel
import { useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, IconButton,
  Image, Text, Input, useToast, VStack
} from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../../Context/ChatProvider'


const ProfileModel = ({ user, children }) => {
  if (!user) return null;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [pic, setPic] = useState(user?.pic || "");
  const toast = useToast();
  const {setUser } = ChatState();

  const handleUpdate = async () => {
    if (!name || !email || !pic) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Make sure token is available
        },
      };
      // console.log("token", user.token);
      

      const { data } = await axios.put(
        "http://localhost:3000/api/user/profile", // Adjust route if needed
        { name, email, pic },
        config
      );

      // Save updated user info
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      toast({
        title: "Profile Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom"
      });

      setEditMode(false);
      onClose();
    } catch (error) {
      console.log("Update error:", error);
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom"
      });
    }
  };

  const postDetail = async (pic) => {
    if (pic === undefined) {
      toast({
        title: "Please Select the Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log("pic pic", pic);
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const data = new FormData()
      data.append('file', pic)
      data.append('upload_preset', 'chat_app')
      data.append('cloud_name', 'dzpltmv9i')

      const res = await fetch('https://api.cloudinary.com/v1_1/dzpltmv9i/image/upload', {
        method: "POST",
        body: data
      })
      const resData = await res.json();
      setPic(resData.url);
    }
    else {
      toast({
        title: "Please Select the Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

  }
  
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={() => { onClose(); setEditMode(false); }}>
        <ModalOverlay />
        <ModalContent h={editMode ? "auto" : "410px"}>
          <ModalHeader fontSize="40px" fontFamily="Work sans" textAlign="center">
            {editMode ? "Update Profile" : user.name}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" alignItems="center">
            {editMode ? (
              <VStack spacing={4} w="100%">
                <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input onChange={(e) => { postDetail(e.target.files[0]) }} className='w-full h-10 mt-2 px-2 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='file' type="file" placeholder='Upload your picture' />
                <Image borderRadius="full" boxSize="100px" src={pic} alt="Preview" />
              </VStack>
            ) : (
              <>
                <Image borderRadius="full" boxSize='150px' src={user.pic} alt={user.name} />
                <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
                  Email: {user.email}
                </Text>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            {editMode ? (
              <Button onClick={handleUpdate} colorScheme="green">
                Save
              </Button>
            ) : (
              <Button onClick={() => setEditMode(true)} colorScheme="blue">
                Update
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
