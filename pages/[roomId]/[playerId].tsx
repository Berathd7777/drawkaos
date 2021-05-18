import { Heading } from '@chakra-ui/react'
import { PlayerProvider, usePlayer } from 'contexts/Player'
import { PlayersProvider, usePlayers } from 'contexts/Players'
import { RoomProvider, useRoom } from 'contexts/Room'
import { Playing } from 'flows/room/Playing'
import { PreviewPlayers } from 'flows/room/PreviewPlayers'
import { PreviewRoom } from 'flows/room/PreviewRoom'
import { Results } from 'flows/room/Results'
import { useRouter } from 'next/router'
import React from 'react'
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
          <Content />
        </PlayerProvider>
      </PlayersProvider>
    </RoomProvider>
  )
}

function Content() {
  const room = useRoom()
  const player = usePlayer()
  const players = usePlayers()

  if (room.status === ROOM_STATUS.CREATED) {
    return (
      <>
        <PreviewRoom showPlayButton={room.adminId === player.id} />
        <PreviewPlayers />
      </>
    )
  }

  if (room.status === ROOM_STATUS.FINISHED) {
    return (
      <>
        <Heading>{room.name}: The game has finished</Heading>
        <Results />
      </>
    )
  }

  if (room.status === ROOM_STATUS.PLAYING) {
    return (
      <Playing key={room.step} room={room} player={player} players={players} />
    )
  }

  throw new Error('Unknown room status: ' + room.status)
}

export default PlayerId
