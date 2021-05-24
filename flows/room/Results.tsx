import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react'
import { Avatar } from 'components/Avatar'
import { Heart, Smile, ThumbDown, ThumbUp } from 'components/Emojis'
import { Reply } from 'components/Reply'
import { usePlayer } from 'contexts/Player'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'contexts/Toasts'
import { useReactions } from 'hooks/useReactions'
import React, { useState } from 'react'
import FadeIn from 'react-fade-in'
import StringSanitizer from 'string-sanitizer'
import { Player, Result } from 'types/Player'
import { REACTION_TYPE } from 'types/Reaction'
import { initGame } from 'utils/initGame'
import { toggleReaction } from 'utils/toggleReaction'

export function Results() {
  const room = useRoom()
  const player = usePlayer()
  const players = usePlayers()
  const { showToast } = useToasts()
  const [isGeneratingGIF, setIsGeneratingGIF] = useState(false)
  const [isPreparingNewRound, setIsPreparingNewRound] = useState(false)

  const downloadGIF = (player: Player) => {
    setIsGeneratingGIF(true)

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
        setIsGeneratingGIF(false)
      })
  }

  const playAgain = async () => {
    try {
      setIsPreparingNewRound(true)

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

  return (
    <Stack spacing="4">
      <Stack
        spacing="4"
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          colorScheme="tertiary"
          onClick={playAgain}
          disabled={room.adminId !== player.id}
          isLoading={isPreparingNewRound}
          loadingText="Wait..."
        >
          Play again
        </Button>
      </Stack>
      <Accordion allowToggle>
        {players.map((player) => (
          <AccordionItem key={player.id}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Stack direction="row" spacing="4" alignItems="center">
                    <AccordionIcon />
                    <Text>{player.name}</Text>
                  </Stack>
                </AccordionButton>
                {/* the key is a hack to make the fade animation work in every accordion expansion */}
                <AccordionPanel key={`${isExpanded}`}>
                  <Stack spacing="4" alignItems="center">
                    <FadeIn delay={2000} className="w-full">
                      {player.results.map((result, index) => (
                        <PlayerAnswer
                          key={result.id}
                          align={index % 2 === 0 ? 'left' : 'right'}
                          result={result}
                        />
                      ))}
                    </FadeIn>
                    <Button
                      colorScheme="tertiary"
                      onClick={() => {
                        downloadGIF(player)
                      }}
                      isLoading={isGeneratingGIF}
                      loadingText="Generating .gif"
                    >
                      Download .gif
                    </Button>
                  </Stack>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
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
