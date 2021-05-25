import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Draw } from 'components/Draw'
import { Reply } from 'components/Reply'
import { useToasts } from 'contexts/Toasts'
import { storage } from 'firebase/init'
import { GameState } from 'hooks/useGameState'
import React, { useMemo, useRef, useState } from 'react'
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasTouched, setCanvasTouched] = useState(false)
  const [sentence, setSentence] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const shouldDraw = gameState.step % 2 !== 0
  const step = gameState.step

  const saveReply = async () => {
    if (isSaving) {
      return
    }

    setIsSaving(true)

    try {
      if (shouldDraw) {
        const MIME_TYPE = 'image/jpeg'
        const imgURL = canvasRef.current.toDataURL(MIME_TYPE)

        const file = await storage
          .child(`${room.id}/${player.id}/${gameState.step + 1}`)
          .putString(imgURL, 'data_url')

        const drawUrl = await file.ref.getDownloadURL()

        await addPlayerAnswer(
          room,
          player,
          RESULT_TYPE.DRAW,
          drawUrl,
          gameState.step
        )
      } else {
        await addPlayerAnswer(
          room,
          player,
          RESULT_TYPE.SENTENCE,
          sentence || '(Empty)',
          gameState.step
        )
      }
    } catch (error) {
      /* TODO: it would be nice to retry */
      console.error(error)

      showToast({
        status: 'error',
        description: 'There was an error while saving your reply. Try again.',
      })
    }
  }

  const previousReply = useMemo(() => {
    const previousReplyPlayerId = player.steps[step]

    if (!previousReplyPlayerId) {
      return null
    }

    const previousPlayer = players.find((p) => p.id === previousReplyPlayerId)

    if (!previousPlayer) {
      return null
    }

    return previousPlayer.results[step - 1]
  }, [player, players, step])

  const doneButton = (
    <Button
      colorScheme="tertiary"
      onClick={saveReply}
      disabled={shouldDraw ? !canvasTouched : !sentence}
      isLoading={isSaving}
      loadingText="Wait..."
    >
      Done
    </Button>
  )

  return (
    <Stack spacing="4">
      <Heading as="h1" textAlign="center">
        {room.name}
      </Heading>
      <Box backgroundColor="background.800" borderRadius="md" padding="4">
        <Stack spacing="4">
          <Stack
            spacing="4"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            height={10}
          >
            <Text>
              Step {step + 1}/{players.length}
            </Text>
            <Box>
              {!isSaving && (
                <CountdownCircleTimer
                  isPlaying
                  duration={room.stepTime}
                  onComplete={() => {
                    saveReply()
                  }}
                  size={40}
                  strokeWidth={4}
                  colors={[
                    ['#16A34A', 0.33],
                    ['#FACC15', 0.33],
                    ['#DC2626', 0.33],
                  ]}
                >
                  {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
              )}
            </Box>
          </Stack>
          {previousReply && <Reply align="center" result={previousReply} />}
          {shouldDraw ? (
            <Draw
              canvasRef={canvasRef}
              canDraw={!isSaving}
              doneButton={doneButton}
              setCanvasTouched={setCanvasTouched}
            />
          ) : (
            <Stack spacing="4" alignItems="center" justifyContent="center">
              <FormControl id="sentence">
                <FormLabel>
                  {step
                    ? 'Describe the drawing...'
                    : 'Write something for others to draw...'}
                </FormLabel>
                <Input
                  value={sentence}
                  onChange={(event) => {
                    setSentence(event.target.value)
                  }}
                  disabled={isSaving}
                  maxLength={280}
                  variant="filled"
                />
              </FormControl>
              {doneButton}
            </Stack>
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
      </Box>
    </Stack>
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
        <Text textAlign="center">
          Waiting for {missingPlayers} to finish...
        </Text>
      ) : null}
    </>
  )
}
