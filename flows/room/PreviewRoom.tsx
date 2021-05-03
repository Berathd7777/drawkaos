import {
  Alert,
  AlertIcon,
  Heading,
  Input,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { useRoom } from 'contexts/Room'
import React, { useMemo } from 'react'
import { REMOTE_DATA } from 'types/RemoteData'

export function PreviewRoom() {
  const { status, error, data } = useRoom()

  const roomLink = useMemo(() => {
    if (!data) {
      return ''
    }

    return `${window.location.origin}/${data.id}`
  }, [data])

  if (status === REMOTE_DATA.IDLE || status === REMOTE_DATA.LOADING) {
    return <Spinner />
  }

  if (status === REMOTE_DATA.ERROR) {
    return (
      <Alert status="error">
        <AlertIcon />
        There was an error while getting the room ({error})
      </Alert>
    )
  }

  return (
    <Stack spacing="4">
      <Heading as="h1">Room: {data.name}</Heading>
      <Input value={roomLink} isDisabled={true} width="full" />
    </Stack>
  )
}
