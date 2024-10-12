import { useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import React from 'react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,IconButton } from '@chakra-ui/react'
import { Image,Text } from '@chakra-ui/react'

const  ProfileModel=({user,children})=> {
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!user) {
    return null; // Or a loading spinner if you prefer
  }

  
  return (
    <>
      
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
          fontSize="40px"
          fontFamily="Work sans"
          display="flex"
          justifyContent= "center"          
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
            borderRadius="full"
              boxSize='150px'
              src={user.pic}
              alt={user.name}
              isCentered
            />
            <Text fontSize={{base: "28px",md:"30px"}}
            fontFamily="Work san"
            display="flex"
            justifyContent="center"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel
