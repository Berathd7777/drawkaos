import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Stack,
  TypographyProps,
} from '@chakra-ui/react'
import { Reply } from 'components/Reply'
import { usePlayers } from 'contexts/Players'
import React from 'react'
import FadeIn from 'react-fade-in'
import { Result } from 'types/Player'

export function Results() {
  const players = usePlayers()

  /* TODO: add a way to play again */
  return (
    <Stack spacing="4">
      <Accordion allowToggle allowMultiple>
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
                  </FadeIn>
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
  align: TypographyProps['textAlign']
  result: Result
  showAuthor: boolean
}

function PlayerAnswer({ result, align, showAuthor }: ResultProps) {
  const players = usePlayers()

  return (
    <Stack key={result.author} spacing="2">
      {showAuthor && (
        <Heading as="h3" fontSize="lg" textAlign={align}>
          {players.find((p) => p.id === result.author).name}
        </Heading>
      )}
      <Reply result={result} align={align} />
    </Stack>
  )
}
