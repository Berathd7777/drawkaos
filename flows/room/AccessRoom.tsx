import {
  Alert,
  AlertIcon,
  Button,
  chakra,
  Input,
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { useRoom } from 'contexts/Room'
import { useRouter } from 'next/router'
import React, { SyntheticEvent, useCallback } from 'react'
import { REMOTE_DATA } from 'types/RemoteData'
import { createPlayer } from 'utils/createPlayer'

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
}
interface AccessRoomFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export function AccessRoom() {
  const toast = useToast()
  const router = useRouter()
  const { status, error, data } = useRoom()

  const onSubmit = useCallback(
    async (event: SyntheticEvent<AccessRoomFormElement>) => {
      const toastId = toast({
        title: 'Creating...',
        status: 'info',
      })

      try {
        event.preventDefault()

        const name = event.currentTarget.elements.name.value

        const { id } = await createPlayer({ name, roomId: data.id })

        toast.update(toastId, {
          title: 'Success!',
          status: 'success',
        })

        router.push(`${data.id}/${id}`)
      } catch (error) {
        toast.update(toastId, {
          title: 'Error',
          status: 'error',
        })

        console.error(error)
      }
    },
    [router, toast, data]
  )

  if (status === REMOTE_DATA.IDLE || status === REMOTE_DATA.LOADING) {
    return <Spinner />
  }

  if (status === REMOTE_DATA.ERROR) {
    return (
      <Alert status="error">
        <AlertIcon />
        There was an error while getting the room ({error})
      </Alert>
    )
  }

  return (
    <chakra.form onSubmit={onSubmit}>
      <Stack spacing="4">
        <Input name="name" placeholder="Your name" />
        <Button type="submit">Access room</Button>
      </Stack>
    </chakra.form>
  )
}
