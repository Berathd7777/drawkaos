import { Heading, Stack } from '@chakra-ui/react'
import { CreateRoomForm } from 'flows/home/CreateRoomForm'
import React from 'react'

function Home() {
  /* const ids = [
    { id: 'Cris' },
    { id: 'Cami' },
    { id: 'Pato' },
    { id: 'Juli' },
  ].map(({ id }) => id) */

  /*
    Personas que van a jugar
    ['cris', 'cami', 'pato', 'juli']

              Línea 1   Línea 2   Línea 3   Línea 4
    Turno 1   cris      cami      pato      juli
    Turno 2   cami      pato      juli      cris
    Turno 3   pato      juli      cris      cami
    Turno 4   juli      cris      cami      pato
  */

  /* const lines = ids.reduce((acc, currId, currIdx, arr) => {
    const others = [...arr.slice(currIdx + 1), ...arr.slice(0, currIdx)]
    const line = [currId, ...others]

    return [...acc, line]
  }, [])

  console.log(lines) */

  return (
    <Stack spacing="8">
      <Heading as="h1">gartic-phone</Heading>
      <CreateRoomForm />
    </Stack>
  )
}

export default Home
