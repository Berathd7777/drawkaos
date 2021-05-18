import { Button, Heading, Stack } from '@chakra-ui/react'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'hooks/useToasts'
import { knuthShuffle } from 'knuth-shuffle'
import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { initGame } from 'utils/initGame'

type Props = {
  showPlayButton?: boolean
}

export function PreviewRoom({ showPlayButton = false }: Props) {
  const room = useRoom()
  const players = usePlayers()
  const { showToast, updateToast } = useToasts()

  const play = async () => {
    const toastId = showToast({
      description: 'Preparing the room...',
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
        roomId: room.id,
        game: shuffledColumns,
        players,
      })

      updateToast(toastId, {
        status: 'success',
        title: 'Yeay!',
        description: 'Room successfully configured',
      })
    } catch (error) {
      updateToast(toastId, {
        status: 'error',
        title: 'Ups!',
        description: 'There was an error',
      })

      console.error(error)
    }
  }

  const showToastOnCopy = () => {
    showToast({
      title: 'Yeay!',
      description: 'Copied!',
      status: 'success',
    })
  }

  /* TODO: consider at least 4 players */

  return (
    <Stack spacing="4">
      <Heading as="h1">{room.name}</Heading>
      <Stack direction="row" spacing="4" alignItems="center">
        {showPlayButton && (
          <Button colorScheme="green" onClick={play}>
            Play
          </Button>
        )}
        <CopyToClipboard
          text={`${window.location.origin}/${room.id}`}
          onCopy={showToastOnCopy}
        >
          <Button>Copy invite link</Button>
        </CopyToClipboard>
      </Stack>
    </Stack>
  )
}
