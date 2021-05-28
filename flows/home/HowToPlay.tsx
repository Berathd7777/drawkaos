import { Button, Stack } from '@chakra-ui/react'
import { Step1, Step2, Step3, Step4, Step5 } from 'components/Icons'
import { Information } from 'components/Information'
import React, { useState } from 'react'

const CONTENT = [
  {
    icon: <Step1 width="20" height="20" />,
    title: 'Calling is better',
    description: 'Invite your friends to a voice call (e.g.: Discord, Zoom).',
  },
  {
    icon: <Step2 width="20" height="20" />,
    title: 'Time to write',
    description: 'Each player must write a quirky sentence.',
  },
  {
    icon: <Step3 width="20" height="20" />,
    title: 'Time to draw',
    description: 'You gonna receive a bizarre sentence to draw.',
  },
  {
    icon: <Step4 width="20" height="20" />,
    title: 'What is it?',
    description: 'Try to describe one of the crazy drawings.',
  },
  {
    icon: <Step5 width="20" height="20" />,
    title: 'See what happened',
    description: 'Watch the hilarious results of the telephone game.',
  },
]

export function HowToPlay() {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <Stack spacing="4">
      <Information
        icon={CONTENT[currentSlide].icon}
        title={CONTENT[currentSlide].title}
        description={CONTENT[currentSlide].description}
      />
      <Stack
        spacing="4"
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        {[0, 1, 2, 3, 4].map((slideNumber) => (
          <Button
            key={slideNumber}
            size="sm"
            colorScheme="primary"
            variant={slideNumber === currentSlide ? 'solid' : 'ghost'}
            onClick={() => {
              setCurrentSlide(slideNumber)
            }}
          >
            {slideNumber + 1}
          </Button>
        ))}
      </Stack>
    </Stack>
  )
}
