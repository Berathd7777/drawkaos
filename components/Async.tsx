import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/alert'
import { Box } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
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
        <Spinner />
      </Box>
    )
  }

  if (status === REMOTE_DATA.ERROR) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Ups!</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
