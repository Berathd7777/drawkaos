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
import { Reply } from 'components/Reply'
import { usePlayer } from 'contexts/Player'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useReactions } from 'hooks/useReactions'
import React, { useState } from 'react'
import FadeIn from 'react-fade-in'
import {
  MdFavorite,
  MdFileDownload,
  MdPlayArrow,
  MdPlusOne,
  MdSentimentVerySatisfied,
  MdThumbDown,
} from 'react-icons/md'
import StringSanitizer from 'string-sanitizer'
import { Player, Result } from 'types/Player'
import { REACTION_TYPE } from 'types/Reaction'
import { initGame } from 'utils/initGame'
import { toggleReaction } from 'utils/toggleReaction'

export function Results() {
  const room = useRoom()
  const player = usePlayer()
  const players = usePlayers()
  const [isProcessing, setIsProcessing] = useState(false)

  const downloadGIF = (player: Player) => {
    setIsProcessing(true)

    const answers = player.results.map((result) => ({
      ...result,
      author: players.find((p) => p.id === result.author).name,
    }))

    fetch('/api/create-gif', {
      method: 'POST',
      body: JSON.stringify(answers),
    })
      .then(async (response) => {
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

        return URL.createObjectURL(blob)
      })
      .then((url: string) => {
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
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  const playAgain = async () => {
    await initGame({
      roomId: room.id,
      players,
      action: 'RESET',
    })
  }

  return (
    <Stack spacing="4">
      <Accordion allowToggle>
        {players.map((player) => (
          <AccordionItem key={player.id}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Stack direction="row" spacing="4" alignItems="center">
                    <AccordionIcon />
                    <Avatar seed={player.name} />
                    <Heading as="h2" fontSize="xl">
                      {player.name}
                    </Heading>
                  </Stack>
                </AccordionButton>
                {/* the key is a hack to make the fade animation work in every accordion expansion */}
                <AccordionPanel key={`${isExpanded}`}>
                  <FadeIn delay={1000}>
                    {player.results.map((result, index) => (
                      <PlayerAnswer
                        align={index % 2 === 0 ? 'left' : 'right'}
                        key={result.author}
                        result={result}
                      />
                    ))}
                    <Box textAlign="center" mt="4">
                      <Button
                        colorScheme="tertiary"
                        variant="outline"
                        onClick={() => {
                          downloadGIF(player)
                        }}
                        isLoading={isProcessing}
                        leftIcon={<MdFileDownload />}
                      >
                        Download .gif
                      </Button>
                    </Box>
                  </FadeIn>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
      {room.adminId === player.id && (
        <Box textAlign="center">
          <Button
            colorScheme="tertiary"
            onClick={playAgain}
            leftIcon={<MdPlayArrow />}
          >
            Play again
          </Button>
        </Box>
      )}
    </Stack>
  )
}

type ResultProps = {
  align: 'left' | 'right'
  result: Result
}

function PlayerAnswer({ result, align }: ResultProps) {
  const currentPlayer = usePlayer()
  const players = usePlayers()

  const justifyContent = align === 'left' ? 'flex-start' : 'flex-end'
  const player = players.find((p) => p.id === result.author)

  return (
    <Box mt="4">
      <Stack key={result.author} spacing="4">
        <Stack
          spacing="4"
          direction="row"
          alignItems="center"
          justifyContent={justifyContent}
        >
          <Avatar seed={player.name} />
          <Heading as="h3" fontSize="lg">
            {player.name}
          </Heading>
        </Stack>
        <Reply result={result} align={align} />
        <Reactions
          playerId={currentPlayer.id}
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
  const [isUpdating, setIsUpdating] = useState(false)
  const reactions = useReactions(resultId)

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
        colorScheme="tertiary"
        variant="ghost"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.LOVE)
        }}
        leftIcon={<MdFavorite />}
      >
        <Text>{reactions.love}</Text>
      </Button>
      <Button
        colorScheme="tertiary"
        variant="ghost"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.SMILE)
        }}
        leftIcon={<MdSentimentVerySatisfied />}
      >
        {reactions.smile && <Text>{reactions.smile}</Text>}
      </Button>
      <Button
        colorScheme="tertiary"
        variant="ghost"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.PLUS_ONE)
        }}
        leftIcon={<MdPlusOne />}
      >
        {reactions.plusOne && <Text>{reactions.plusOne}</Text>}
      </Button>
      <Button
        colorScheme="tertiary"
        variant="ghost"
        disabled={isUpdating}
        onClick={() => {
          updateReaction(REACTION_TYPE.THUMB_DOWN)
        }}
        leftIcon={<MdThumbDown />}
      >
        {reactions.thumbDown && <Text>{reactions.thumbDown}</Text>}
      </Button>
    </Stack>
  )
}
