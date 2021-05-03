import { Box, Button, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import { Draw } from 'components/Draw'
import { PlayerProvider } from 'contexts/Player'
import { PlayersProvider } from 'contexts/Players'
import { RoomProvider, useRoom } from 'contexts/Room'
import { storage } from 'firebase/init'
import { PreviewPlayers } from 'flows/room/PreviewPlayers'
import { PreviewRoom } from 'flows/room/PreviewRoom'
import { RoomActions } from 'flows/room/RoomActions'
import useInterval from 'hooks/useInterval'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { REMOTE_DATA } from 'types/RemoteData'
import { ROOM_STATUS } from 'types/Room'

function PlayerId() {
  const router = useRouter()
  const roomId = Array.isArray(router.query.roomId)
    ? router.query.roomId[0]
    : router.query.roomId
  const playerId = Array.isArray(router.query.playerId)
    ? router.query.playerId[0]
    : router.query.playerId

  return (
    <RoomProvider roomId={roomId}>
      <PlayersProvider roomId={roomId}>
        <PlayerProvider roomId={roomId} playerId={playerId}>
          <Content playerId={playerId} />
        </PlayerProvider>
      </PlayersProvider>
    </RoomProvider>
  )
}

type ContentProps = {
  playerId: string
}

function Content({ playerId }: ContentProps) {
  const { status, error, data } = useRoom()

  if (status === REMOTE_DATA.IDLE || status === REMOTE_DATA.LOADING) {
    return <Spinner />
  }

  if (status === REMOTE_DATA.ERROR || error) {
    console.error('NOOO')

    return null
  }

  if (data.status === ROOM_STATUS.CREATED) {
    return (
      <Stack spacing="4">
        <PreviewRoom />
        <RoomActions />
        <PreviewPlayers playerId={playerId} />
      </Stack>
    )
  }

  if (data.status === ROOM_STATUS.FINISHED) {
    return (
      <Stack spacing="4">
        <Heading>The game has finished</Heading>
      </Stack>
    )
  }

  if (data.status === ROOM_STATUS.PLAYING) {
    return <Playing playerId={playerId} roomId={data.id} />
  }

  /* THIS SHOULD NEVER HAPPEN */
  return null
}

type PlayingProps = {
  playerId: string
  roomId: string
}

function Playing({ playerId, roomId }: PlayingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)

  useInterval(
    () => {
      if (seconds === 10) {
        console.log('TIEMPO')

        setRunning(false)

        return
      }

      setSeconds(seconds + 1)
    },
    running ? 1000 : null
  )

  useEffect(() => {
    const saveImage = async () => {
      if (!running) {
        const MIME_TYPE = 'image/jpeg'
        const imgURL = canvasRef.current.toDataURL(MIME_TYPE)

        const file = await storage
          .child(`${roomId}/${playerId}/1`)
          .putString(imgURL, 'data_url')

        file.ref
          .getDownloadURL()
          .then((downloadURL) => {
            console.log(downloadURL)

            /* TODO: update model */
          })
          .catch((error) => {
            console.error('TODO MAL', error)

            alert('error uploading the image')
          })
      }
    }

    saveImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  return (
    <Stack spacing="4">
      <Heading>Playing</Heading>
      <Stack
        spacing="4"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>{running && <Text>{10 - seconds} seconds left</Text>}</Box>
        <Box>
          <Button
            onClick={() => {
              setRunning(false)
            }}
          >
            Done
          </Button>
        </Box>
      </Stack>
      <Draw canvasRef={canvasRef} canDraw={running} />
    </Stack>
  )
}

export default PlayerId
