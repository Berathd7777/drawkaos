import { Box, Button, chakra, Heading, Input, Stack } from '@chakra-ui/react'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'hooks/useToasts'
import { useRouter } from 'next/router'
import React, { SyntheticEvent } from 'react'
import { createPlayer } from 'utils/createPlayer'

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
}
interface AccessRoomFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export function AccessRoom() {
  const room = useRoom()
  const { showToast, updateToast } = useToasts()
  const router = useRouter()

  const onSubmit = async (event: SyntheticEvent<AccessRoomFormElement>) => {
    const toastId = showToast({
      description: 'Joining the room...',
    })

    try {
      event.preventDefault()

      const name = event.currentTarget.elements.name.value

      const { id: playerId } = await createPlayer({ name, roomId: room.id })

      updateToast(toastId, {
        status: 'success',
        title: 'Yeay!',
        description: `You've joined the room`,
      })

      router.push(`${room.id}/${playerId}`)
    } catch (error) {
      updateToast(toastId, {
        status: 'error',
        title: 'Ups!',
        description: 'There was an error',
      })

      console.error(error)
    }
  }

  return (
    <Stack spacing="4">
      <Heading fontSize="xl">Join a room</Heading>
      <chakra.form onSubmit={onSubmit}>
        <Stack spacing="4">
          <Input name="name" placeholder="John Doe" maxLength={140} />
          <Box textAlign="center">
            <Button type="submit" colorScheme="tertiary">
              Access room
            </Button>
          </Box>
        </Stack>
      </chakra.form>
    </Stack>
  )
}
