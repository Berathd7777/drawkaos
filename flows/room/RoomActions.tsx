import { Alert, AlertIcon, Box, Button, Spinner } from '@chakra-ui/react'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { knuthShuffle } from 'knuth-shuffle'
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

    const lines = ids.reduce((acc, currId, currIdx, arr) => {
      const others = [...arr.slice(currIdx + 1), ...arr.slice(0, currIdx)]
      const line = [currId, ...others]

      return [...acc, line]
    }, [])

    const linesAmount = lines.length
    const shuffledRowIndexes = knuthShuffle([...Array(linesAmount).keys()])
    const shuffledLines = lines.reduce((acc, curr, currIdx) => {
      acc[shuffledRowIndexes[currIdx]] = curr

      return acc
    }, [])

    const columnsAmount = lines[0].length
    const shuffledColumnIndexes = knuthShuffle([...Array(columnsAmount).keys()])
    const shuffledColumns = shuffledLines.reduce((acc, curr, currIdx) => {
      acc[currIdx] = shuffledColumnIndexes.map((n) => curr[n])

      return acc
    }, [])

    console.log(shuffledColumns)

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
