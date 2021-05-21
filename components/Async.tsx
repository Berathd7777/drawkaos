import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Spinner,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { REMOTE_DATA } from 'types/RemoteData'

type Props = {
  children: ReactNode
  errorMessage: ReactNode
  status: REMOTE_DATA
}

export function Async({ children, errorMessage, status }: Props) {
  if (status === REMOTE_DATA.IDLE || status === REMOTE_DATA.LOADING) {
    return (
      <Box textAlign="center">
        <Spinner size="xl" thickness="5px" />
      </Box>
    )
  }

  if (status === REMOTE_DATA.ERROR) {
    return (
      <Alert status="error" variant="solid">
        <AlertIcon />
        <AlertTitle>Ups!</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
