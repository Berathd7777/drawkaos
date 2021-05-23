import { Box, Heading, Stack } from '@chakra-ui/react'
import { PlayerProvider, usePlayer } from 'contexts/Player'
import { PlayersProvider, usePlayers } from 'contexts/Players'
import { RoomProvider, useRoom } from 'contexts/Room'
import { ConfigureRoom } from 'flows/room/ConfigureRoom'
import { PlayersList } from 'flows/room/PlayersList'
import { Playing } from 'flows/room/Playing'
import { Results } from 'flows/room/Results'
import { useGameState } from 'hooks/useGameState'
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
  const gameState = useGameState()

  if (gameState.status === ROOM_STATUS.CREATED) {
    return (
      <Stack spacing="4">
        <Heading as="h1" textAlign="center">
          {room.name}
        </Heading>
        <Stack spacing="4" direction="row">
          <Box flex="1">
            <ConfigureRoom />
          </Box>
          <Box width="72">
            <Box backgroundColor="background.800" borderRadius="md" padding="4">
              <PlayersList />
            </Box>
          </Box>
        </Stack>
      </Stack>
    )
  }

  if (gameState.status === ROOM_STATUS.FINISHED) {
    return (
      <Stack spacing="4">
        <Heading as="h1" textAlign="center">
          {room.name}: game finished
        </Heading>
        <Results />
      </Stack>
    )
  }

  if (gameState.status === ROOM_STATUS.PLAYING) {
    return (
      <Playing
        key={gameState.step}
        room={room}
        player={player}
        players={players}
        gameState={gameState}
      />
    )
  }

  throw new Error('Unknown room status: ' + gameState.status)
}

export default PlayerId
