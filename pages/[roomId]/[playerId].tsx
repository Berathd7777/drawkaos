import { Box, Stack } from '@chakra-ui/react'
import { ColourBox } from 'components/ColourBox'
import { Page } from 'components/Page'
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
      <Page title={room.name}>
        <Stack spacing="4" direction="row">
          <Box flex="1">
            <ConfigureRoom />
          </Box>
          <Box width="80">
            <ColourBox>
              <PlayersList />
            </ColourBox>
          </Box>
        </Stack>
      </Page>
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

  if (gameState.status === ROOM_STATUS.FINISHED) {
    return (
      <Page title={`${room.name}: game finished`}>
        <Results />
      </Page>
    )
  }

  throw new Error('Unknown room status: ' + gameState.status)
}

export default PlayerId
