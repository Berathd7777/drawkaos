import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react'
import React from 'react'

function NotFound() {
  return (
    <Alert status="error" justifyContent="center">
      <AlertIcon />
      <AlertTitle>Page Not Found</AlertTitle>
    </Alert>
  )
}

export default NotFound
