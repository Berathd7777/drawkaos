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
import { addPlayerToRoom } from 'utils/addPlayerToRoom'

type Props = { roomId: string }

export function JoinFormRoom({ roomId }: Props) {
  const router = useRouter()
  const { showToast, updateToast } = useToasts()
  const [formData, setFormData] = useState({
    userName: '',
  })
  const [isWorking, setIsWorking] = useState(false)

  const canSubmit = useMemo(() => {
    return formData.userName
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
      description: 'Joining the room...',
    })

    try {
      setIsWorking(true)

      const { id: playerId } = await addPlayerToRoom({
        roomId: roomId,
        name: formData.userName,
      })

      updateToast(toastId, {
        status: 'success',
        title: 'Yeay!',
        description: `You've joined the room`,
      })

      router.push(`${roomId}/${playerId}`)
    } catch (error) {
      updateToast(toastId, {
        status: 'error',
        title: 'Ups!',
        description: 'There was an error',
      })

      console.error(error)
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <chakra.form onSubmit={onSubmit}>
      <Stack spacing="4">
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
            loadingText="Joining..."
          >
            Join
          </Button>
        </Stack>
      </Stack>
    </chakra.form>
  )
}
