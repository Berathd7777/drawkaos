import { Box, Button, Heading, Input, Stack } from '@chakra-ui/react'
import { Draw } from 'components/Draw'
import { Reply } from 'components/Reply'
import { storage } from 'firebase/init'
import { GameState } from 'hooks/useGameState'
import useInterval from 'hooks/useInterval'
import { useToasts } from 'hooks/useToasts'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { MdDone } from 'react-icons/md'
import { Player, RESULT_TYPE } from 'types/Player'
import { Room } from 'types/Room'
import { addPlayerAnswer } from 'utils/addPlayerAnswer'

const SECONDS_DEADLINE = 60

type PlayingProps = {
  room: Room
  player: Player
  players: Player[]
  gameState: GameState
}

export function Playing({ room, player, players, gameState }: PlayingProps) {
  const { showToast, updateToast } = useToasts()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sentence, setSentence] = useState('')
  /* TODO: consider use a timestamp so we can refresh the page and get the current time and not a resetted one */
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)

  const shouldDraw = gameState.step % 2 !== 0
  const step = gameState.step

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

  useInterval(
    () => {
      if (seconds === SECONDS_DEADLINE) {
        setRunning(false)

        return
      }

      setSeconds(seconds + 1)
    },
    running ? 1000 : null
  )

  useEffect(() => {
    const saveImage = async () => {
      let toastId = null

      try {
        if (!running) {
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
              sentence,
              gameState.step
            )
          }

          updateToast(toastId, {
            status: 'success',
            description: 'Saved!',
          })
        }
      } catch (error) {
        updateToast(toastId, {
          status: 'error',
          description: 'There was an error',
        })

        console.error(error)
      }
    }

    saveImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const placeholder = step
    ? 'Describe the drawing...'
    : 'Write something for others to draw...'

  return (
    <Stack spacing="4">
      <Heading as="h1" textAlign="center">
        {room.name}
      </Heading>
      <Heading fontSize="xl" textAlign="center">
        Step {step + 1} of {players.length}
      </Heading>
      <Stack
        spacing="4"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <CountdownCircleTimer
            isPlaying={running}
            duration={SECONDS_DEADLINE}
            size={48}
            strokeWidth={5}
            colors={[
              ['#16A34A', 0.33],
              ['#FACC15', 0.33],
              ['#DC2626', 0.33],
            ]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </Box>
        <Box>
          <Button
            colorScheme="tertiary"
            leftIcon={<MdDone />}
            onClick={() => {
              setRunning(false)
            }}
            disabled={!running}
          >
            Done
          </Button>
        </Box>
      </Stack>
      {previousReply && <Reply align="center" result={previousReply} />}
      {shouldDraw ? (
        <Draw canvasRef={canvasRef} canDraw={running} />
      ) : (
        <Input
          value={sentence}
          onChange={(event) => {
            setSentence(event.target.value)
          }}
          name="sentence"
          placeholder={placeholder}
          maxLength={280}
          variant="filled"
        />
      )}
    </Stack>
  )
}
