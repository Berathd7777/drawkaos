import { Alert, AlertIcon, Box, Button, Spinner } from '@chakra-ui/react'
import { useRoom } from 'contexts/Room'
import React from 'react'
import { REMOTE_DATA } from 'types/RemoteData'
import { ROOM_STATUS } from 'types/Room'
import { updateRoom } from 'utils/updateRoom'

export function RoomActions() {
  const { status, error, data } = useRoom()

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

  const play = () => {
    if (!data) {
      return
    }

    updateRoom({
      id: data.id,
      status: ROOM_STATUS.PLAYING,
    })
  }

  return (
    <Box>
      <Button colorScheme="green" onClick={play}>
        Play
      </Button>
    </Box>
  )
}
