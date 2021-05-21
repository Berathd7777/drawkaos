import { Select, Stack, Text } from '@chakra-ui/react'
import { usePlayer } from 'contexts/Player'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'hooks/useToasts'
import React, { ChangeEvent } from 'react'
import { updateRoom } from 'utils/updateRoom'

export function ConfigureRoom() {
  const room = useRoom()
  const player = usePlayer()
  const { showToast } = useToasts()

  const updateRoomSettings = async (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      await updateRoom({
        id: room.id,
        stepTime: Number(event.target.value),
      })
    } catch (error) {
      showToast({
        status: 'error',
        title: 'Ups!',
        description: 'There was an error updating the room',
      })

      console.error(error)
    }
  }

  return (
    <Stack spacing="4">
      <Stack spacing="4" direction="row" alignItems="center">
        <Text>Round time:</Text>
        <Select
          flex="1"
          variant="filled"
          value={room.stepTime}
          onChange={updateRoomSettings}
          disabled={room.adminId !== player.id}
        >
          <option value="30">30 seconds</option>
          <option value="60">1 minute</option>
          <option value="120">2 minutes</option>
        </Select>
      </Stack>
    </Stack>
  )
}
