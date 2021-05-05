import { Heading, Stack } from '@chakra-ui/react'
import { CreateRoomForm } from 'flows/home/CreateRoomForm'
import React from 'react'

function Home() {
  return (
    <Stack spacing="8">
      <Heading as="h1">gartic-phone</Heading>
      <CreateRoomForm />
    </Stack>
  )
}

export default Home
