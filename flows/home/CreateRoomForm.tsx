import { Button, chakra, Input, Stack, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { SyntheticEvent } from 'react'
import { createRoom } from 'utils/createRoom'

interface FormElements extends HTMLFormControlsCollection {
  roomName: HTMLInputElement
  userName: HTMLInputElement
}
interface CreateRoomFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export function CreateRoomForm() {
  const toast = useToast()
  const router = useRouter()

  const onSubmit = async (event: SyntheticEvent<CreateRoomFormElement>) => {
    const toastId = toast({
      title: 'Creating...',
      status: 'info',
      position: 'bottom-left',
    })

    try {
      event.preventDefault()

      const roomName = event.currentTarget.elements.roomName.value
      const userName = event.currentTarget.elements.userName.value

      const { roomId, adminId } = await createRoom({
        name: roomName,
        adminName: userName,
      })

      toast.update(toastId, {
        title: 'Room created!',
        status: 'success',
      })

      router.push(`${roomId}/${adminId}`)
    } catch (error) {
      toast.update(toastId, {
        title: 'Error',
        status: 'error',
      })

      console.error(error)
    }
  }

  return (
    <chakra.form onSubmit={onSubmit}>
      <Stack spacing="4">
        <Input name="roomName" placeholder="Room name" />
        <Input name="userName" placeholder="Your name" />
        <Button type="submit">Create</Button>
      </Stack>
    </chakra.form>
  )
}
