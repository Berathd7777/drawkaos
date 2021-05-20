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
  TypographyProps,
} from '@chakra-ui/react'
import { Reply } from 'components/Reply'
import { usePlayer } from 'contexts/Player'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import React, { useState } from 'react'
import FadeIn from 'react-fade-in'
import { MdFileDownload, MdPlayArrow } from 'react-icons/md'
import StringSanitizer from 'string-sanitizer'
import { Player, Result } from 'types/Player'
import { initGame } from 'utils/initGame'

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
                  <Stack direction="row" spacing="2" alignItems="center">
                    <AccordionIcon />
                    <Heading as="h2" fontSize="xl" textAlign="left">
                      {player.name}
                    </Heading>
                  </Stack>
                </AccordionButton>
                {/* the key is a hack to make the fade animation work in every accordion expansion */}
                <AccordionPanel pb={4} key={`${isExpanded}`}>
                  <FadeIn delay={2000}>
                    {player.results.map((result, index) => (
                      <PlayerAnswer
                        showAuthor={!!index}
                        align={index % 2 === 0 ? 'left' : 'right'}
                        key={result.author}
                        result={result}
                      />
                    ))}
                    <Box textAlign="center" mt="4">
                      <Button
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
  align: TypographyProps['textAlign']
  result: Result
  showAuthor: boolean
}

function PlayerAnswer({ result, align, showAuthor }: ResultProps) {
  const players = usePlayers()

  return (
    <Box mt="4">
      <Stack key={result.author} spacing="4">
        {showAuthor && (
          <Heading as="h3" fontSize="lg" textAlign={align}>
            {players.find((p) => p.id === result.author).name}
          </Heading>
        )}
        <Reply result={result} align={align} />
      </Stack>
    </Box>
  )
}
