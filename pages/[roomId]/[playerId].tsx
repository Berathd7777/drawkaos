import { Box, Heading, Stack } from '@chakra-ui/react'
import { ColourBox } from 'components/ColourBox'
import { One, Three, Two } from 'components/Icons'
import { Information } from 'components/Information'
import { PlayerProvider, usePlayer } from 'contexts/Player'
import { PlayersProvider, usePlayers } from 'contexts/Players'
import { RoomProvider, useRoom } from 'contexts/Room'
import { SOUNDS, useSounds } from 'contexts/Sounds'
import { ConfigureRoom } from 'flows/room/ConfigureRoom'
import { PlayersList } from 'flows/room/PlayersList'
import { Playing } from 'flows/room/Playing'
import { Results } from 'flows/room/Results'
import { useGameState } from 'hooks/useGameState'
import { useInterval } from 'hooks/useInterval'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
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
      <Stack spacing="8" direction="row">
        <Stack spacing="4" flex="1">
          <Heading as="h1" textAlign="center">
            Configure game
          </Heading>
          <ConfigureRoom />
        </Stack>
        <Box width="80">
          <ColourBox>
            <PlayersList />
          </ColourBox>
        </Box>
      </Stack>
    )
  }

  if (gameState.status === ROOM_STATUS.PLAYING) {
    return (
      <Announcement isVisible={!gameState.step}>
        <Playing
          key={gameState.step}
          room={room}
          player={player}
          players={players}
          gameState={gameState}
        />
      </Announcement>
    )
  }

  if (gameState.status === ROOM_STATUS.FINISHED) {
    return <Results />
  }

  throw new Error('Unknown room status: ' + gameState.status)
}

const ICONS = {
  0: Three,
  1: Two,
  2: One,
  3: () => void 0,
}

type AnnouncementProps = {
  children: ReactNode
  isVisible: boolean
}

function Announcement({ children, isVisible }: AnnouncementProps) {
  const [times, setTimes] = useState(isVisible ? 0 : 3)
  const { play } = useSounds()

  useEffect(() => {
    if (times === 0) {
      play(SOUNDS.ANNOUNCEMENT)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useInterval(
    () => {
      setTimes(times + 1)
    },
    times < 3 ? 1000 : null
  )

  const Icon = ICONS[times]

  return times < 3 ? (
    <Information
      icon={<Icon width="20" height="20" />}
      title={!times ? 'Ready?' : times === 1 ? 'Steady' : 'Go'}
    />
  ) : (
    <>{children}</>
  )
}

export default PlayerId
