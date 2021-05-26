import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { ColourBox } from 'components/ColourBox'
import { Draw } from 'components/Draw'
import { Page } from 'components/Page'
import { Reply } from 'components/Reply'
import { useToasts } from 'contexts/Toasts'
import { storage } from 'firebase/init'
import { GameState } from 'hooks/useGameState'
import React, { useMemo, useRef, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'
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
  const canvasRef = useRef<CanvasDraw>(null)
  const [sentence, setSentence] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  /*
    HACK
    https://github.com/embiem/react-canvas-draw/issues/43#issue-527164185
  */
  const getDraw = () => {
    // @ts-ignore
    return canvasRef.current.canvasContainer.children[1].toDataURL()
  }

  const shouldDraw = gameState.step % 2 !== 0
  const step = gameState.step

  const saveReply = async () => {
    if (isSaving) {
      return
    }

    setIsSaving(true)

    try {
      if (shouldDraw) {
        const imgURL = getDraw()

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
      console.error(error)

      showToast({
        status: 'error',
        description: 'There was an error while saving your reply. Try again.',
      })

      setIsSaving(false)
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
    <Button colorScheme="tertiary" onClick={saveReply} isLoading={isSaving}>
      Done
    </Button>
  )

  return (
    <Page title={room.name}>
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
              canvasRef={canvasRef}
              canDraw={!isSaving}
              doneButton={doneButton}
            />
          ) : (
            <Stack spacing="8" alignItems="center" justifyContent="center">
              <FormControl id="sentence" isDisabled={isSaving}>
                <FormLabel>
                  {step
                    ? 'Describe the drawing'
                    : 'Write something for others to draw'}
                </FormLabel>
                <Input
                  value={sentence}
                  onChange={(event) => {
                    setSentence(event.target.value)
                  }}
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
      </ColourBox>
    </Page>
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
