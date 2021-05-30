import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'
import { Avatar } from 'components/Avatar'
import { useToasts } from 'contexts/Toasts'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { createRoom } from 'utils/createRoom'

export function CreateRoomForm() {
  const router = useRouter()
  const { showToast } = useToasts()
  const [formData, setFormData] = useState({
    userName: '',
  })
  const [isWorking, setIsWorking] = useState(false)
  const initialFocusRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus()
    }
  }, [])

  const canSubmit = useMemo(() => {
    return !!formData.userName
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

    try {
      setIsWorking(true)

      const { roomId, adminId } = await createRoom({
        adminName: formData.userName,
      })

      router.push(`${roomId}/${adminId}`)
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        title: 'Ups!',
        description: 'There was an error while creating the room. Try again.',
      })
    }
  }

  return (
    <chakra.form onSubmit={onSubmit}>
      <Stack spacing="4">
        <Stack spacing="4" direction="row" alignItems="center">
          <Avatar seed={formData.userName} />
          <FormControl id="userName" isDisabled={isWorking} flex="1">
            <FormLabel>Your name</FormLabel>
            <Input
              value={formData.userName}
              onChange={onChange}
              variant="filled"
              maxLength={140}
              ref={initialFocusRef}
            />
          </FormControl>
        </Stack>
        <Stack alignItems="center" justifyContent="center">
          <Button
            type="submit"
            colorScheme="primary"
            disabled={!canSubmit}
            isLoading={isWorking}
            loadingText="Creating"
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </chakra.form>
  )
}
