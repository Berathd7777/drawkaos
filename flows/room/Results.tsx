import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react'
import { Avatar } from 'components/Avatar'
import { ColourBox } from 'components/ColourBox'
import { Heart, Poop, Smile, ThumbUp } from 'components/Icons'
import { Reply } from 'components/Reply'
import { usePlayer } from 'contexts/Player'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'contexts/Toasts'
import { useReactions } from 'hooks/useReactions'
import fileDownload from 'js-file-download'
import { Frame } from 'pages/api/create-picture'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import FadeIn from 'react-fade-in'
import { MdChevronLeft, MdChevronRight, MdFileDownload } from 'react-icons/md'
import StringSanitizer from 'string-sanitizer'
import { Player, Result, RESULT_TYPE } from 'types/Player'
import { REACTION_TYPE } from 'types/Reaction'
import { initGame } from 'utils/initGame'
import { toggleReaction } from 'utils/toggleReaction'
import { updateRoom } from 'utils/updateRoom'

export function Results() {
  const room = useRoom()
  const user = usePlayer()
  const players = usePlayers()
  const { showToast } = useToasts()
  const [isWorking, setIsWorking] = useState(false)
  const initialFocusRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus()
    }
  }, [])

  const isAdmin = room.adminId === user.id

  const selectedPlayer = useMemo(() => {
    return room.albumIndex > -1 ? players[room.albumIndex] : null
  }, [players, room])

  const onUpdateRoom = async (albumIndex: number) => {
    try {
      setIsWorking(true)

      await updateRoom({
        id: room.id,
        albumIndex,
      })
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        title: 'Ups!',
        description: `There was an error while updating the album's visualization. Try again.`,
      })
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <Stack spacing="8" direction="row">
      <Box width="80">
        <Stack spacing="2">
          {players.map((player, index) => {
            const isSelected = index === room.albumIndex

            return (
              <Stack
                key={player.id}
                spacing="4"
                direction="row"
                alignItems="center"
                paddingY="2"
                paddingX="4"
                backgroundColor={isSelected ? 'background.800' : null}
                borderRadius="md"
              >
                <Avatar seed={player.name} />
                <Text flex="1" isTruncated>
                  {player.name}
                </Text>
              </Stack>
            )
          })}
        </Stack>
      </Box>
      <Box flex="1">
        <ColourBox>
          {selectedPlayer ? (
            <PlayerResult
              key={room.albumIndex}
              albumIndex={room.albumIndex}
              player={selectedPlayer}
              onUpdateRoom={onUpdateRoom}
              isAdmin={isAdmin}
            />
          ) : (
            <Stack
              spacing="4"
              direction="row"
              alignItems="center"
              justifyContent="center"
              minHeight="32"
            >
              {isAdmin ? (
                <Button
                  colorScheme="primary"
                  onClick={() => {
                    onUpdateRoom(0)
                  }}
                  isLoading={isWorking}
                  loadingText="Wait"
                  ref={initialFocusRef}
                >
                  {`Start album's visualization`}
                </Button>
              ) : (
                <Text textAlign="center">
                  {`Waiting for the host to start the album's visualization.`}
                </Text>
              )}
            </Stack>
          )}
        </ColourBox>
      </Box>
    </Stack>
  )
}

type PlayerResultProps = {
  isAdmin: boolean
  albumIndex: number
  player: Player
  onUpdateRoom: (albumIndex: number) => Promise<void>
}

function PlayerResult({
  player,
  albumIndex,
  onUpdateRoom,
  isAdmin,
}: PlayerResultProps) {
  const room = useRoom()
  const players = usePlayers()
  const { showToast } = useToasts()
  const [isWorking, setIsWorking] = useState(false)
  const [isGeneratingGIF, setIsGeneratingGIF] = useState(false)
  const initialFocusRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus()
    }
  }, [])

  const downloadGIF = (player: Player) => {
    setIsGeneratingGIF(true)

    const answers = player.results.map((result) => ({
      ...result,
      author: players.find((p) => p.id === result.author).name,
    }))

    fetch('/api/create-album', {
      method: 'POST',
      body: JSON.stringify(answers),
    })
      .then(async (response) => {
        if (!response.ok) {
          showToast({
            status: 'error',
            title: 'Ups!',
            description:
              'There was an error while generating the album. Try again.',
          })

          return
        }

        const reader = response.body.getReader()

        const chunks = []

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          chunks.push(value)
        }

        const blob = new Blob(chunks)

        const sanitizedPlayerName = StringSanitizer.sanitize(player.name)
        const fileName = `${sanitizedPlayerName}.gif`

        fileDownload(blob, fileName)
      })
      .catch((error) => {
        console.error(error)

        showToast({
          status: 'error',
          title: 'Ups!',
          description:
            'There was an error while generating the album. Try again.',
        })
      })
      .finally(() => {
        setIsGeneratingGIF(false)
      })
  }

  const playAgain = async () => {
    try {
      setIsWorking(true)

      await initGame({
        roomId: room.id,
        players,
        action: 'RESET',
      })
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        title: 'Ups!',
        description: 'There was an error while resetting the game. Try again.',
      })
    }
  }

  const updateAlbumIndex = async (albumIndex: number) => {
    try {
      setIsWorking(true)

      await onUpdateRoom(albumIndex)
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        title: 'Ups!',
        description: `There was an error while updating the album's visualization. Try again.`,
      })
    }
  }

  return (
    <Stack spacing="4" alignItems="center">
      <Box as={FadeIn} delay={2000} width="full">
        {player.results.map((result, index, arr) => (
          <PlayerAnswer
            key={result.id}
            isFirstRow={!index}
            align={index % 2 === 0 ? 'left' : 'right'}
            result={result}
            prevResult={index ? arr[index - 1] : null}
          />
        ))}
      </Box>
      <Divider />
      <Stack
        spacing="4"
        direction="row"
        alignItems="center"
        justifyContent={isAdmin ? 'space-between' : 'center'}
        width="full"
      >
        <Box>
          <Button
            leftIcon={<MdFileDownload />}
            colorScheme="primary"
            onClick={() => {
              downloadGIF(player)
            }}
            isLoading={isGeneratingGIF}
            loadingText="Generating album"
          >
            Download album
          </Button>
        </Box>
        <Stack spacing="4" direction="row" alignItems="center">
          {isAdmin && albumIndex && (
            <IconButton
              aria-label="Previous album"
              icon={<MdChevronLeft />}
              colorScheme="primary"
              onClick={() => {
                updateAlbumIndex(albumIndex - 1)
              }}
              isLoading={isWorking}
            />
          )}
          {isAdmin ? (
            albumIndex < players.length - 1 ? (
              <IconButton
                aria-label="Next album"
                icon={<MdChevronRight />}
                colorScheme="primary"
                onClick={() => {
                  updateAlbumIndex(albumIndex + 1)
                }}
                isLoading={isWorking}
                ref={initialFocusRef}
              />
            ) : (
              <Button
                colorScheme="primary"
                onClick={playAgain}
                isLoading={isWorking}
                loadingText="Wait"
                ref={initialFocusRef}
              >
                Play again
              </Button>
            )
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  )
}

type ResultProps = {
  align: 'left' | 'right'
  result: Result
  prevResult: Result | null
  isFirstRow: boolean
}

function PlayerAnswer({ result, align, isFirstRow, prevResult }: ResultProps) {
  const { showToast } = useToasts()
  const player = usePlayer()
  const players = usePlayers()
  const [isGeneratingPicture, setIsGeneratingPicture] = useState(false)

  const justifyContent = align === 'left' ? 'flex-start' : 'flex-end'
  const author = players.find((p) => p.id === result.author)

  const downloadPicture = ({ upperText, picture, lowerText }: Frame) => {
    setIsGeneratingPicture(true)

    fetch('/api/create-picture', {
      method: 'POST',
      body: JSON.stringify({ upperText, picture, lowerText }),
    })
      .then(async (response) => {
        if (!response.ok) {
          showToast({
            status: 'error',
            title: 'Ups!',
            description:
              'There was an error while generating the picture. Try again.',
          })

          return
        }

        const reader = response.body.getReader()

        const chunks = []

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          chunks.push(value)
        }

        const blob = new Blob(chunks)

        const sanitizedUpperText = StringSanitizer.sanitize(upperText)
        const sanitizedLowerText = StringSanitizer.sanitize(lowerText || '')
        const last = lowerText ? ` - ${sanitizedLowerText}` : ''

        const fileName = `${sanitizedUpperText}${last}.png`
        fileDownload(blob, fileName)
      })
      .catch((error) => {
        console.error(error)

        showToast({
          status: 'error',
          title: 'Ups!',
          description:
            'There was an error while generating the picture. Try again.',
        })
      })
      .finally(() => {
        setIsGeneratingPicture(false)
      })
  }

  return (
    <Box mt={isFirstRow ? 0 : '8'}>
      <Stack key={result.author} spacing="4">
        <Stack
          spacing="4"
          direction="row"
          alignItems="center"
          justifyContent={justifyContent}
        >
          <Avatar seed={author.name} />
          <Text maxWidth="60" isTruncated>
            {author.name}
          </Text>
        </Stack>
        <Reply result={result} align={align} />
        <Stack
          spacing="0"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            {result.type === RESULT_TYPE.DRAW && (
              <IconButton
                aria-label="Download picture"
                icon={<MdFileDownload />}
                colorScheme="primary"
                onClick={() => {
                  downloadPicture({
                    upperText: prevResult ? prevResult.value : author.name,
                    picture: result.value,
                    lowerText: prevResult ? author.name : '',
                  })
                }}
                isLoading={isGeneratingPicture}
              />
            )}
          </Box>
          <Reactions
            playerId={player.id}
            resultId={result.id}
            justifyContent={justifyContent}
          />
        </Stack>
      </Stack>
    </Box>
  )
}

type ReactionsProps = {
  justifyContent?: StackProps['justifyContent']
  playerId: string
  resultId: string
}

function Reactions({
  justifyContent = 'flex-start',
  playerId,
  resultId,
}: ReactionsProps) {
  const { reactions, userReactions } = useReactions(playerId, resultId)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateReaction = async (reactionType: REACTION_TYPE) => {
    try {
      setIsUpdating(true)

      await toggleReaction({
        resultId,
        reactionType,
        playerId,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Stack spacing="4" direction="row" justifyContent={justifyContent}>
      <Button
        colorScheme={userReactions.love ? 'primary' : 'background'}
        variant="ghost"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.LOVE)
        }}
        leftIcon={<Heart height="10" width="6" />}
      >
        <Text minWidth="1ch">{reactions.love}</Text>
      </Button>
      <Button
        colorScheme={userReactions.smile ? 'primary' : 'background'}
        variant="ghost"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.SMILE)
        }}
        leftIcon={<Smile height="10" width="6" />}
      >
        <Text minWidth="1ch">{reactions.smile}</Text>
      </Button>
      <Button
        colorScheme={userReactions.thumbUp ? 'primary' : 'background'}
        variant="ghost"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.THUMB_UP)
        }}
        leftIcon={<ThumbUp height="10" width="6" />}
      >
        <Text minWidth="1ch">{reactions.thumbUp}</Text>
      </Button>
      <Button
        colorScheme={userReactions.thumbDown ? 'primary' : 'background'}
        variant="ghost"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.THUMB_DOWN)
        }}
        leftIcon={<Poop height="10" width="6" />}
      >
        <Text minWidth="1ch">{reactions.thumbDown}</Text>
      </Button>
    </Stack>
  )
}
