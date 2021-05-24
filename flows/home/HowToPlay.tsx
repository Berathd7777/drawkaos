import { Button, Heading, Stack, Text } from '@chakra-ui/react'
import { Call, Draw, Laugh, Question, Write } from 'components/Icons'
import React, { useState } from 'react'

const CONTENT = [
  {
    title: 'Calling is better',
    description: 'Invite your friends to a voice call (e.g.: Discord, Zoom)',
    icon: <Call width="20" height="20" />,
  },
  {
    title: 'Time to write',
    description: 'Each player must write a quirky sentence',
    icon: <Write width="20" height="20" />,
  },
  {
    title: 'Time to draw',
    description: 'You gonna receive a bizarre sentence to draw',
    icon: <Draw width="20" height="20" />,
  },
  {
    title: 'What is it?',
    description: 'Try to describe one of the crazy drawings',
    icon: <Question width="20" height="20" />,
  },
  {
    title: 'See what happened',
    description: 'Watch the hilarious results of the telephone game',
    icon: <Laugh width="20" height="20" />,
  },
]

export function HowToPlay() {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <Stack spacing="8">
      <Stack spacing="4" alignItems="center" justifyContent="center">
        {CONTENT[currentSlide].icon}
        <Heading fontSize="lg" color="tertiary.500">
          {CONTENT[currentSlide].title}
        </Heading>
        <Text textAlign="center">{CONTENT[currentSlide].description}</Text>
      </Stack>
      <Stack
        spacing="2"
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        {[0, 1, 2, 3, 4].map((slideNumber) => (
          <Button
            key={slideNumber}
            size="sm"
            colorScheme="tertiary"
            variant={slideNumber === currentSlide ? 'solid' : 'ghost'}
            onClick={() => {
              setCurrentSlide(slideNumber)
            }}
          >
            &#x25CF;
          </Button>
        ))}
      </Stack>
    </Stack>
  )
}
