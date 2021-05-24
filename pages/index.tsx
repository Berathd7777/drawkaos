import { Box, Heading, Stack } from '@chakra-ui/react'
import { CreateRoomForm } from 'flows/home/CreateRoomForm'
import { HowToPlay } from 'flows/home/HowToPlay'
import React from 'react'

function Home() {
  return (
    <Stack spacing="4">
      <Heading as="h1" textAlign="center">
        Welcome to Garlic phone
      </Heading>
      <Stack spacing="4" direction="row">
        <Box flex="1">
          <Stack spacing="4">
            <Heading fontSize="xl">Create a room</Heading>
            <CreateRoomForm />
          </Stack>
        </Box>
        <Box width="72">
          <Box backgroundColor="background.800" borderRadius="md" padding="4">
            <Stack spacing="4">
              <Heading fontSize="xl" textAlign="center">
                How to play
              </Heading>
              <HowToPlay />
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Stack>
  )
}

export default Home
