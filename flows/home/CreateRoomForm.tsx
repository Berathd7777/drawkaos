import { Button, chakra, Input, Stack } from '@chakra-ui/react'
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
  const router = useRouter()

  const onSubmit = async (event: SyntheticEvent<CreateRoomFormElement>) => {
    event.preventDefault()

    const roomName = event.currentTarget.elements.roomName.value
    const userName = event.currentTarget.elements.userName.value

    try {
      const { roomId, adminId } = await createRoom(roomName, userName)

      router.push(`${roomId}/${adminId}`)
    } catch (error) {
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
