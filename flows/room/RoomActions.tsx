import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { knuthShuffle } from 'knuth-shuffle'
import React from 'react'
import { REMOTE_DATA } from 'types/RemoteData'
import { initGame } from 'utils/initGame'

export function RoomActions() {
  const toast = useToast()
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

  const play = async () => {
    if (!data) {
      return
    }

    const toastId = toast({
      title: 'Preparing the room...',
      status: 'info',
    })

    try {
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
      const shuffledColumnIndexes = knuthShuffle([
        ...Array(columnsAmount).keys(),
      ])
      const shuffledColumns = shuffledLines.reduce((acc, curr, currIdx) => {
        acc[currIdx] = shuffledColumnIndexes.map((n) => curr[n])

        return acc
      }, [])

      await initGame({
        roomId: data.id,
        game: shuffledColumns,
        players,
      })

      toast.update(toastId, {
        title: 'Room successfully configured!',
        status: 'success',
      })
    } catch (error) {
      toast.update(toastId, {
        title: 'Error',
        status: 'error',
      })

      console.error(error)
    }
  }

  return (
    <Box>
      <Button colorScheme="green" onClick={play}>
        Play
      </Button>
    </Box>
  )
}
