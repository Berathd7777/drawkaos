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
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { Player, RESULT_TYPE } from 'types/Player'
import { Room } from 'types/Room'
import { addPlayerAnswer } from 'utils/addPlayerAnswer'

type PlayingProps = {
  room: Room
  player: Player
  players: Player[]
  gameState: GameState
}

export function Playing({ room, player, players, gameState }: PlayingProps) {
  const { showToast, updateToast } = useToasts()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasTouched, setCanvasTouched] = useState(false)
  const [sentence, setSentence] = useState('')
  const [isRunning, setIsRunning] = useState(true)

  const shouldDraw = gameState.step % 2 !== 0
  const step = gameState.step

  useEffect(() => {
    const saveImage = async () => {
      let toastId = null

      try {
        if (!isRunning) {
          toastId = showToast({
            description: 'Saving...',
          })

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

          updateToast(toastId, {
            status: 'success',
            description: 'Saved!',
          })
        }
      } catch (error) {
        console.error(error)

        updateToast(toastId, {
          status: 'error',
          description: 'There was an error',
        })
      }
    }

    saveImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

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
      onClick={() => {
        setIsRunning(false)
      }}
      disabled={!isRunning || shouldDraw ? !canvasTouched : !sentence}
    >
      {isRunning ? 'Done' : 'Wait...'}
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
              {isRunning && (
                <CountdownCircleTimer
                  isPlaying
                  duration={room.stepTime}
                  onComplete={() => {
                    setIsRunning(false)
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
              canDraw={isRunning}
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
                  maxLength={280}
                  variant="filled"
                />
              </FormControl>
              {doneButton}
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
