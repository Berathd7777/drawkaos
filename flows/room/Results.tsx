import {
  Box,
  Button,
  Divider,
  Heading,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react'
import { Avatar } from 'components/Avatar'
import { Heart, Smile, ThumbDown, ThumbUp, UpHand } from 'components/Icons'
import { Reply } from 'components/Reply'
import { usePlayer } from 'contexts/Player'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'contexts/Toasts'
import { useReactions } from 'hooks/useReactions'
import React, { useMemo, useState } from 'react'
import FadeIn from 'react-fade-in'
import StringSanitizer from 'string-sanitizer'
import { Player, Result } from 'types/Player'
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
    <Stack spacing="4" direction="row">
      <Box width="72">
        <Stack spacing="2">
          {players.map((player, index) => (
            <Stack
              key={player.id}
              spacing="4"
              direction="row"
              alignItems="center"
              paddingY="2"
              paddingX="4"
              backgroundColor={
                index === room.albumIndex ? 'background.800' : null
              }
              borderRadius="md"
            >
              <Avatar seed={player.name} />
              <Heading as="h3" fontSize="lg">
                {player.name}
              </Heading>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Box flex="1">
        <Box backgroundColor="background.800" borderRadius="md" padding="4">
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
                  colorScheme="tertiary"
                  onClick={() => {
                    onUpdateRoom(0)
                  }}
                  isLoading={isWorking}
                  loadingText="Wait..."
                >
                  {`Start album's visualization`}
                </Button>
              ) : (
                <Stack spacing="4" alignItems="center">
                  <UpHand width="20" height="20" />
                  <Text textAlign="center">
                    {`Waiting for the host to start the album's visualization`}
                  </Text>
                </Stack>
              )}
            </Stack>
          )}
        </Box>
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

  const downloadGIF = (player: Player) => {
    setIsWorking(true)

    const answers = player.results.map((result) => ({
      ...result,
      author: players.find((p) => p.id === result.author).name,
    }))

    fetch('/api/create-gif', {
      method: 'POST',
      body: JSON.stringify(answers),
    })
      .then(async (response) => {
        if (!response.ok) {
          showToast({
            status: 'error',
            title: 'Ups!',
            description:
              'There was an error while generating the gif. Try again.',
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

        const url = URL.createObjectURL(blob)

        const sanitizedRoomName = StringSanitizer.sanitize(room.name)
        const sanitizedPlayerName = StringSanitizer.sanitize(player.name)

        const a = document.createElement('a')
        a.href = url
        a.download = `${sanitizedRoomName} - ${sanitizedPlayerName}.gif`
        a.style.visibility = 'hidden'

        document.body.appendChild(a)

        a.click()
        a.remove()
      })
      .catch((error) => {
        console.error(error)

        showToast({
          status: 'error',
          title: 'Ups!',
          description:
            'There was an error while generating the gif. Try again.',
        })
      })
      .finally(() => {
        setIsWorking(false)
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
      <FadeIn delay={2000}>
        {player.results.map((result, index) => (
          <PlayerAnswer
            key={result.id}
            align={index % 2 === 0 ? 'left' : 'right'}
            result={result}
          />
        ))}
      </FadeIn>
      <Divider />
      <Stack
        spacing="0"
        direction="row"
        alignItems="center"
        justifyContent={isAdmin ? 'space-between' : 'center'}
        width="full"
      >
        <Button
          colorScheme="tertiary"
          variant={isAdmin ? 'ghost' : 'solid'}
          onClick={() => {
            downloadGIF(player)
          }}
          isLoading={isWorking}
          loadingText="Generating .gif"
        >
          Download .gif
        </Button>
        <Stack spacing="4" direction="row" alignItems="center">
          {isAdmin && albumIndex && (
            <Button
              colorScheme="tertiary"
              variant="outline"
              onClick={() => {
                updateAlbumIndex(albumIndex - 1)
              }}
              isLoading={isWorking}
              loadingText="Moving to the previous album..."
            >
              Previous album
            </Button>
          )}
          {isAdmin ? (
            albumIndex < players.length - 1 ? (
              <Button
                colorScheme="tertiary"
                onClick={() => {
                  updateAlbumIndex(albumIndex + 1)
                }}
                isLoading={isWorking}
                loadingText="Moving to the next album..."
              >
                Next album
              </Button>
            ) : (
              <Button
                colorScheme="tertiary"
                onClick={playAgain}
                isLoading={isWorking}
                loadingText="Wait..."
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
}

function PlayerAnswer({ result, align }: ResultProps) {
  const player = usePlayer()
  const players = usePlayers()

  const justifyContent = align === 'left' ? 'flex-start' : 'flex-end'
  const author = players.find((p) => p.id === result.author)

  return (
    <Box mt="4">
      <Stack key={result.author} spacing="4">
        <Stack
          spacing="4"
          direction="row"
          alignItems="center"
          justifyContent={justifyContent}
        >
          <Avatar seed={author.name} />
          <Heading as="h3" fontSize="lg">
            {author.name}
          </Heading>
        </Stack>
        <Reply result={result} align={align} />
        <Reactions
          playerId={player.id}
          resultId={result.id}
          justifyContent={justifyContent}
        />
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
        colorScheme={userReactions.love ? 'tertiary' : 'background'}
        variant="outline"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.LOVE)
        }}
        leftIcon={<Heart />}
      >
        <Text minWidth="1ch">{reactions.love}</Text>
      </Button>
      <Button
        colorScheme={userReactions.smile ? 'tertiary' : 'background'}
        variant="outline"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.SMILE)
        }}
        leftIcon={<Smile />}
      >
        <Text minWidth="1ch">{reactions.smile}</Text>
      </Button>
      <Button
        colorScheme={userReactions.thumbUp ? 'tertiary' : 'background'}
        variant="outline"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.THUMB_UP)
        }}
        leftIcon={<ThumbUp />}
      >
        <Text minWidth="1ch">{reactions.thumbUp}</Text>
      </Button>
      <Button
        colorScheme={userReactions.thumbDown ? 'tertiary' : 'background'}
        variant="outline"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.THUMB_DOWN)
        }}
        leftIcon={<ThumbDown />}
      >
        <Text minWidth="1ch">{reactions.thumbDown}</Text>
      </Button>
    </Stack>
  )
}
