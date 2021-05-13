import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  Img,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Draw } from 'components/Draw'
import { PlayerProvider, usePlayer } from 'contexts/Player'
import { PlayersProvider, usePlayers } from 'contexts/Players'
import { RoomProvider, useRoom } from 'contexts/Room'
import { storage } from 'firebase/init'
import { PreviewPlayers } from 'flows/room/PreviewPlayers'
import { PreviewRoom } from 'flows/room/PreviewRoom'
import { RoomActions } from 'flows/room/RoomActions'
import useInterval from 'hooks/useInterval'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Player } from 'types/Player'
import { REMOTE_DATA } from 'types/RemoteData'
import { Room, ROOM_STATUS } from 'types/Room'
import { addPlayerDraw } from 'utils/addPlayerDraw'
import { updateRoom } from 'utils/updateRoom'

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
          <Content />
        </PlayerProvider>
      </PlayersProvider>
    </RoomProvider>
  )
}

function Content() {
  const { status: roomStatus, error: roomError, data: room } = useRoom()
  const { status: playerStatus, error: playerError, data: player } = usePlayer()

  if (
    roomStatus === REMOTE_DATA.IDLE ||
    roomStatus === REMOTE_DATA.LOADING ||
    playerStatus === REMOTE_DATA.IDLE ||
    playerStatus === REMOTE_DATA.LOADING
  ) {
    return <Spinner />
  }

  if (
    roomStatus === REMOTE_DATA.ERROR ||
    roomError ||
    playerStatus === REMOTE_DATA.ERROR ||
    playerError
  ) {
    console.log(roomError, playerError)

    return null
  }

  if (room.status === ROOM_STATUS.CREATED && player) {
    return (
      <Stack spacing="4">
        <PreviewRoom />
        {room.adminId === player.id && <RoomActions />}
        <PreviewPlayers playerId={player.id} />
      </Stack>
    )
  }

  if (room.status === ROOM_STATUS.FINISHED && player) {
    return (
      <Stack spacing="4">
        <Heading>The game has finished</Heading>
        <Results />
      </Stack>
    )
  }

  if (room.status === ROOM_STATUS.PLAYING && player) {
    return <Playing player={player} room={room} />
  }

  /* THIS SHOULD NEVER HAPPEN */
  return null
}

type PlayingProps = {
  player: Player
  room: Room
}

function Playing({ player, room }: PlayingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)
  const toast = useToast()

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
      const toastId = toast({
        title: 'Saving...',
        status: 'info',
      })

      try {
        if (!running) {
          const MIME_TYPE = 'image/jpeg'
          const imgURL = canvasRef.current.toDataURL(MIME_TYPE)

          const file = await storage
            .child(`${room.id}/${player.id}/${room.step}`)
            .putString(imgURL, 'data_url')

          const drawUrl = await file.ref.getDownloadURL()

          await addPlayerDraw(room, player, drawUrl)

          if (player.id === room.adminId) {
            const status =
              room.step === player.steps.length
                ? ROOM_STATUS.FINISHED
                : ROOM_STATUS.PLAYING

            await updateRoom({
              id: room.id,
              step: room.step + 1,
              status,
            })
          }

          toast.update(toastId, {
            title: 'Saved!',
            status: 'success',
          })
        }
      } catch (error) {
        toast.update(toastId, {
          title: 'Error',
          status: 'error',
        })

        console.error(error)
      }
    }

    saveImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  return (
    <Stack spacing="4">
      <Heading>Playing</Heading>
      <Heading>
        {/* TODO: use players.lenght */}
        Step {room.step + 1} of {player.steps.length + 1}
      </Heading>
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

function Results() {
  const { status, error, data: players } = usePlayers()

  if (status === REMOTE_DATA.IDLE || status === REMOTE_DATA.LOADING) {
    return <Spinner />
  }

  if (status === REMOTE_DATA.ERROR) {
    return (
      <Alert status="error">
        <AlertIcon />
        There was an error while getting the players ({error})
      </Alert>
    )
  }

  return (
    <Stack spacing="4">
      {players.map((player) => (
        <>
          <Heading>{player.name}</Heading>
          {player.results.map((result) => (
            <Stack key={result.author} spacing="4">
              <Heading fontSize="larger">
                {players.find((p) => p.id === result.author).name}
              </Heading>
              <Box>
                <Img src={result.value} marginX="auto" />
              </Box>
            </Stack>
          ))}
        </>
      ))}
    </Stack>
  )
}

export default PlayerId
