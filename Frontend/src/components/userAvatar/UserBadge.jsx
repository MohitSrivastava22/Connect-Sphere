import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/layout'
import React from 'react'

function UserBadge({user,handleFunction}) {
  return (
      <Badge px={2}
          py={1}
          borderRadius="lg"
          m={1}
          mb={2}
          variant="solid"
          fontSize={12}
          colorScheme="purple"
          color="black"
          cursor="pointer"
          onClick={handleFunction}>
            {user.name}
            <CloseIcon/>
    </Badge>
  )
}

export default UserBadge
