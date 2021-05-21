import { Box, Button, chakra, Input, Stack } from '@chakra-ui/react'
import { Avatar } from 'components/Avatar'
import { useToasts } from 'hooks/useToasts'
import { useRouter } from 'next/router'
import React, { ChangeEvent, SyntheticEvent, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { createRoom } from 'utils/createRoom'

interface FormElements extends HTMLFormControlsCollection {
  roomName: HTMLInputElement
  userName: HTMLInputElement
}
interface CreateRoomFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export function CreateRoomForm() {
  const { showToast, updateToast } = useToasts()
  const router = useRouter()
  const [seed, setSeed] = useState('')

  const onSubmit = async (event: SyntheticEvent<CreateRoomFormElement>) => {
    event.preventDefault()

    const roomName = event.currentTarget.elements.roomName.value
    const userName = event.currentTarget.elements.userName.value

    if (!roomName || !userName) {
      return
    }

    const toastId = showToast({
      description: 'Creating...',
    })

    try {
      const { roomId, adminId } = await createRoom({
        name: roomName,
        adminName: userName,
      })

      updateToast(toastId, {
        status: 'success',
        title: 'Yeay!',
        description: 'Room created!',
      })

      router.push(`${roomId}/${adminId}`)
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
    <chakra.form onSubmit={onSubmit}>
      <Stack spacing="4">
        <Input
          name="roomName"
          placeholder="My room"
          maxLength={140}
          variant="filled"
        />
        <Stack spacing="4" direction="row" alignItems="center">
          <Avatar seed={seed} />
          <Input
            name="userName"
            placeholder="John Doe"
            maxLength={140}
            variant="filled"
            onChange={onUserNameChange}
            flex="1"
          />
        </Stack>
        <Box textAlign="center">
          <Button type="submit" colorScheme="tertiary" leftIcon={<MdAdd />}>
            Create
          </Button>
        </Box>
      </Stack>
    </chakra.form>
  )
}
