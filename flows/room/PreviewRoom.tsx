import { Button, Heading, Stack } from '@chakra-ui/react'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'hooks/useToasts'
import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { MdContentCopy, MdPlayArrow } from 'react-icons/md'
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
      await initGame({
        roomId: room.id,
        players,
        action: 'INIT',
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

  const canPlay = players.length > 2

  return (
    <Stack spacing="4">
      <Heading as="h1" textAlign="center">
        {room.name}
      </Heading>
      <Stack direction="row" spacing="4" alignItems="center">
        {showPlayButton && (
          <Button
            colorScheme={canPlay ? 'tertiary' : 'red'}
            onClick={play}
            leftIcon={<MdPlayArrow />}
            disabled={!canPlay}
          >
            {canPlay ? 'Play' : 'At least 3 players needed'}
          </Button>
        )}
        <CopyToClipboard
          text={`${window.location.origin}/${room.id}`}
          onCopy={showToastOnCopy}
        >
          <Button
            colorScheme="tertiary"
            variant="link"
            leftIcon={<MdContentCopy />}
          >
            Copy invite link
          </Button>
        </CopyToClipboard>
      </Stack>
    </Stack>
  )
}
