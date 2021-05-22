import { Box, Spinner } from '@chakra-ui/react'
import { AlertMessage } from 'components/AlertMessage'
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
      <AlertMessage status="error" title="Ups!" description={errorMessage} />
    )
  }

  return <>{children}</>
}
