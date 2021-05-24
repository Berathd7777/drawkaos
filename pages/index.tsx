import { Heading, Stack } from '@chakra-ui/react'
import { CreateRoomForm } from 'flows/home/CreateRoomForm'
import React from 'react'

function Home() {
  return (
    <Stack spacing="4">
      <Heading as="h1" textAlign="center">
        Welcome to Garlic phone
      </Heading>
      <Heading fontSize="xl">Create a room</Heading>
      <CreateRoomForm />
    </Stack>
  )
}

export default Home
