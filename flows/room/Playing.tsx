import {
  Box,
  Button,
  chakra,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { ColourBox } from 'components/ColourBox'
import { Draw } from 'components/Draw'
import { Reply } from 'components/Reply'
import { useToasts } from 'contexts/Toasts'
import { GameState } from 'hooks/useGameState'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { Player, RESULT_TYPE } from 'types/Player'
import {
  ACTIVITY_TYPE,
  Room,
  RoomActivity,
  RoomActivityReply,
} from 'types/Room'
import { addPlayerAnswer } from 'utils/addPlayerAnswer'

type Props = {
  room: Room
  player: Player
  players: Player[]
  gameState: GameState
}

export function Playing({ room, player, players, gameState }: Props) {
  const { showToast } = useToasts()
  const [timeExpired, setTimeExpired] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const shouldDraw = gameState.step % 2 !== 0

  const saveReply = async (value: string) => {
    if (isSaving) {
      return
    }

    setIsSaving(true)

    try {
      await addPlayerAnswer(
        room,
        player,
        shouldDraw ? RESULT_TYPE.DRAW : RESULT_TYPE.SENTENCE,
        value,
        gameState.step
      )

      setTimeExpired(false)
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        description: 'There was an error while saving your reply. Try again.',
      })

      setIsSaving(false)
      setTimeExpired(false)
    }
  }

  const previousReply = useMemo(() => {
    const previousReplyPlayerId = player.steps[gameState.step]

    if (!previousReplyPlayerId) {
      return null
    }

    const previousPlayer = players.find((p) => p.id === previousReplyPlayerId)

    if (!previousPlayer) {
      return null
    }

    return previousPlayer.results[gameState.step - 1]
  }, [player, players, gameState.step])

  return (
    <ColourBox>
      <Stack spacing="8">
        <Stack
          spacing="0"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          height="12"
        >
          <Text>
            Step {gameState.step + 1}/{players.length}
          </Text>
          <Box>
            {!isSaving && (
              <CountdownCircleTimer
                isPlaying
                duration={room.stepTime}
                onComplete={() => {
                  setTimeExpired(true)
                }}
                size={48}
                strokeWidth={4}
                colors={[
                  ['#16A34A', 0.33],
                  ['#FACC15', 0.33],
                  ['#DC2626', 0.33],
                ]}
              >
                {({ remainingTime }) => (
                  <Text fontSize="sm">{remainingTime}</Text>
                )}
              </CountdownCircleTimer>
            )}
          </Box>
        </Stack>
        {previousReply && <Reply align="center" result={previousReply} />}
        {shouldDraw ? (
          <Draw
            key={gameState.step}
            timeExpired={timeExpired}
            saveReply={saveReply}
            storagePath={`${room.id}/${player.id}/${gameState.step + 1}`}
          />
        ) : (
          <Write
            key={gameState.step}
            timeExpired={timeExpired}
            saveReply={saveReply}
            label={
              gameState.step
                ? 'Describe the drawing'
                : 'Write something for others to draw'
            }
          />
        )}
        {isSaving && (
          <WhoIsMissing
            playerId={player.id}
            players={players}
            step={gameState.step}
            activity={room.activity}
          />
        )}
      </Stack>
    </ColourBox>
  )
}

type WhoIsMissingProps = {
  playerId: string
  step: number
  activity: RoomActivity[]
  players: Player[]
}

function WhoIsMissing({
  playerId,
  players,
  activity,
  step,
}: WhoIsMissingProps) {
  const missingPlayers = useMemo(() => {
    const currentRoundActivity = activity.filter(
      (a) => a.type === ACTIVITY_TYPE.REPLY && a.step === step
    ) as RoomActivityReply[]
    const currentRoundPlayers = currentRoundActivity.map((a) => a.playerId)

    const playerNames = players
      .filter(
        (p) =>
          p.id !== playerId &&
          !currentRoundPlayers.find((roundPlayerId) => roundPlayerId === p.id)
      )
      .map((p) => p.name)

    return playerNames.length > 1
      ? playerNames.slice(0, -1).join(', ') + ' and ' + playerNames.slice(-1)
      : playerNames.join(',')
  }, [playerId, players, activity, step])

  return (
    <>
      {missingPlayers ? (
        <Text textAlign="center">Waiting for {missingPlayers} to finish</Text>
      ) : null}
    </>
  )
}

type WriteProps = {
  timeExpired: boolean
  label: ReactNode
  saveReply: (value: string) => Promise<void>
}

function Write({ label, timeExpired, saveReply }: WriteProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [sentence, setSentence] = useState('')
  const initialFocusRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus()
    }
  }, [])

  const submitReply = async () => {
    setIsSaving(true)

    await saveReply(sentence || '(Empty)')
  }

  useEffect(() => {
    if (timeExpired) {
      submitReply()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeExpired])

  return (
    <chakra.form
      onSubmit={(event) => {
        event.preventDefault()

        submitReply()
      }}
    >
      <Stack spacing="8" alignItems="center" justifyContent="center">
        <FormControl id="sentence" isDisabled={isSaving}>
          <FormLabel>{label}</FormLabel>
          <Input
            value={sentence}
            onChange={(event) => {
              setSentence(event.target.value)
            }}
            maxLength={280}
            variant="filled"
            ref={initialFocusRef}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="primary"
          disabled={!sentence || timeExpired}
          isLoading={isSaving}
        >
          Done
        </Button>
      </Stack>
    </chakra.form>
  )
}
