import { Button, chakra, Input, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import { CreatedRoom } from 'pages/api/create-room'
import React, { SyntheticEvent } from 'react'

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

    const response = await fetch('/api/create-room', {
      method: 'POST',
      body: JSON.stringify({
        roomName,
        userName,
      }),
    })

    if (!response.ok) {
      console.error(response.statusText)

      return
    }

    const result: CreatedRoom = await response.json()

    router.push(result.redirectTo)
  }

  return (
    <chakra.form onSubmit={onSubmit}>
      <Stack spacing="4">
        <Input name="roomName" />
        <Input name="userName" />
        <Button type="submit">Crear</Button>
      </Stack>
    </chakra.form>
  )
}
