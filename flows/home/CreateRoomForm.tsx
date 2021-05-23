import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'
import { Avatar } from 'components/Avatar'
import { useToasts } from 'hooks/useToasts'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useMemo, useState } from 'react'
import { createRoom } from 'utils/createRoom'

export function CreateRoomForm() {
  const router = useRouter()
  const { showToast, updateToast } = useToasts()
  const [formData, setFormData] = useState({
    roomName: '',
    userName: '',
  })
  const [isWorking, setIsWorking] = useState(false)

  const canSubmit = useMemo(() => {
    return formData.roomName && formData.userName
  }, [formData])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    })
  }

  const onSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    const toastId = showToast({
      description: 'Creating room...',
    })

    try {
      setIsWorking(true)

      const { roomId, adminId } = await createRoom({
        name: formData.roomName,
        adminName: formData.userName,
      })

      updateToast(toastId, {
        status: 'success',
        title: 'Yeay!',
        description: 'Room created!',
      })

      router.push(`${roomId}/${adminId}`)
    } catch (error) {
      console.error(error)

      updateToast(toastId, {
        status: 'error',
        title: 'Ups!',
        description: 'There was an error',
      })
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <chakra.form onSubmit={onSubmit}>
      <Stack spacing="4">
        <FormControl id="roomName">
          <FormLabel>Room name</FormLabel>
          <Input
            value={formData.roomName}
            onChange={onChange}
            disabled={isWorking}
            variant="filled"
            maxLength={140}
          />
        </FormControl>
        <Stack spacing="4" direction="row" alignItems="center">
          <Avatar seed={formData.userName} />
          <FormControl id="userName" flex="1">
            <FormLabel>Your name</FormLabel>
            <Input
              value={formData.userName}
              onChange={onChange}
              disabled={isWorking}
              variant="filled"
              maxLength={140}
            />
          </FormControl>
        </Stack>
        <Stack alignItems="center" justifyContent="center">
          <Button
            type="submit"
            colorScheme="tertiary"
            disabled={!canSubmit}
            isLoading={isWorking}
            loadingText="Creating..."
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </chakra.form>
  )
}
