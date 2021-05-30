import { Heading, Stack } from '@chakra-ui/react'
import { AlertMessage } from 'components/AlertMessage'
import { PlayersProvider } from 'contexts/Players'
import { RoomProvider, useRoom } from 'contexts/Room'
import { JoinFormRoom } from 'flows/room/JoinRoomForm'
import { useGameState } from 'hooks/useGameState'
import { useRouter } from 'next/router'
import React from 'react'
import { ROOM_STATUS } from 'types/Room'

function RoomId() {
  const router = useRouter()
  const roomId = Array.isArray(router.query.roomId)
    ? router.query.roomId[0]
    : router.query.roomId

  return (
    <RoomProvider roomId={roomId}>
      <PlayersProvider roomId={roomId}>
        <Content />
      </PlayersProvider>
    </RoomProvider>
  )
}

function Content() {
  const room = useRoom()
  const gameState = useGameState()

  const isGameInProgress = gameState.status !== ROOM_STATUS.CREATED

  return (
    <>
      {isGameInProgress ? (
        <AlertMessage
          status="info"
          title="Game in progress."
          description="You'll be able to join this room once the current game finishes."
        />
      ) : (
        <Stack spacing="4">
          <Heading as="h1" textAlign="center">
            Join a room
          </Heading>
          <JoinFormRoom roomId={room.id} />
        </Stack>
      )}
    </>
  )
}

export default RoomId
