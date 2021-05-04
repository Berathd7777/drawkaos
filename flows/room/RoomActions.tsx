import { Alert, AlertIcon, Box, Button, Spinner } from '@chakra-ui/react'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import React from 'react'
import { REMOTE_DATA } from 'types/RemoteData'
import { ROOM_STATUS } from 'types/Room'
import { updateRoom } from 'utils/updateRoom'

export function RoomActions() {
  const { status, error, data } = useRoom()
  const {
    status: statusPlayers,
    error: errorPlayers,
    data: players,
  } = usePlayers()

  if (
    (status || statusPlayers) === REMOTE_DATA.IDLE ||
    (status || statusPlayers) === REMOTE_DATA.LOADING
  ) {
    return <Spinner />
  }

  if ((status || errorPlayers) === REMOTE_DATA.ERROR) {
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

    const ids = players.map(({ id }) => id)

    /*
      Personas que van a jugar
      ['cris', 'cami', 'pato', 'juli']

                Línea 1   Línea 2   Línea 3   Línea 4
      Turno 1   cris      cami      pato      juli
      Turno 2   cami      pato      juli      cris
      Turno 3   pato      juli      cris      cami
      Turno 4   juli      cris      cami      pato
    */

    const result = ids.reduce((acc, currId, currIdx, arr) => {
      return acc
    }, [])

    console.log(result)

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
