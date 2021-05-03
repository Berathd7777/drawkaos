import { Stack } from '@chakra-ui/layout'
import { PlayerProvider } from 'contexts/Player'
import { PlayersProvider } from 'contexts/Players'
import { RoomProvider } from 'contexts/Room'
import { PreviewPlayers } from 'flows/room/PreviewPlayers'
import { PreviewRoom } from 'flows/room/PreviewRoom'
import { useRouter } from 'next/router'
import React from 'react'

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
          <Stack spacing="4">
            <PreviewRoom />
            <PreviewPlayers adminId={playerId} />
          </Stack>
        </PlayerProvider>
      </PlayersProvider>
    </RoomProvider>
  )
}

export default PlayerId
