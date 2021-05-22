import { Box, Button, chakra, Heading, Input, Stack } from '@chakra-ui/react'
import { AlertMessage } from 'components/AlertMessage'
import { Avatar } from 'components/Avatar'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'hooks/useToasts'
import { useRouter } from 'next/router'
import React, { ChangeEvent, SyntheticEvent, useMemo, useState } from 'react'
import { MdChevronRight } from 'react-icons/md'
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
  const [seed, setSeed] = useState('')

  const roomHasActivity = useMemo(() => room.activity.length, [room])

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

  const onUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value)
  }

  return (
    <Stack spacing="4">
      {roomHasActivity ? (
        <AlertMessage
          status="info"
          title="Game in progress"
          description="You'll be able to join this room once the current game finishes."
        />
      ) : (
        <>
          <Heading fontSize="xl" textAlign="center">
            Join a room
          </Heading>
          <chakra.form onSubmit={onSubmit}>
            <Stack spacing="4">
              <Stack spacing="4" direction="row" alignItems="center">
                <Avatar seed={seed} />
                <Input
                  name="name"
                  placeholder="John Doe"
                  maxLength={140}
                  variant="filled"
                  onChange={onUserNameChange}
                  flex="1"
                />
              </Stack>
              <Box textAlign="center">
                <Button
                  type="submit"
                  colorScheme="tertiary"
                  leftIcon={<MdChevronRight />}
                >
                  Access room
                </Button>
              </Box>
            </Stack>
          </chakra.form>
        </>
      )}
    </Stack>
  )
}
