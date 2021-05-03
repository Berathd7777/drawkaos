import { Heading, Stack } from '@chakra-ui/react'
import { PlayerProvider } from 'contexts/Player'
import { PlayersProvider } from 'contexts/Players'
import { RoomProvider, useRoom } from 'contexts/Room'
import { PreviewPlayers } from 'flows/room/PreviewPlayers'
import { PreviewRoom } from 'flows/room/PreviewRoom'
import { RoomActions } from 'flows/room/RoomActions'
import { useRouter } from 'next/router'
import React from 'react'
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

  if (status !== REMOTE_DATA.SUCCESS || error) {
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
    return (
      <Stack spacing="4">
        <Heading>Playing</Heading>
      </Stack>
    )
  }

  /* THIS SHOULD NEVER HAPPEN */
  return null
}

export default PlayerId
