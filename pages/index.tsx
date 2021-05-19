import { Heading } from '@chakra-ui/react'
import { CreateRoomForm } from 'flows/home/CreateRoomForm'
import React from 'react'

function Home() {
  return (
    <>
      <Heading as="h1" textAlign="center">
        Create a room
      </Heading>
      <CreateRoomForm />
    </>
  )
}

export default Home
