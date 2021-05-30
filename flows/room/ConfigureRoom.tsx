import { Button, FormControl, FormLabel, Select, Stack } from '@chakra-ui/react'
import { AlertMessage } from 'components/AlertMessage'
import { CopyInviteLink } from 'components/CopyInviteLink'
import { usePlayer } from 'contexts/Player'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'contexts/Toasts'
import React, { ChangeEvent, useState } from 'react'
import { ACTIVITY_TYPE } from 'types/Room'
import { initGame } from 'utils/initGame'
import { updateRoom } from 'utils/updateRoom'

export function ConfigureRoom() {
  const room = useRoom()
  const player = usePlayer()
  const players = usePlayers()
  const { showToast } = useToasts()
  const [isWorking, setIsWorking] = useState(false)

  const canPlay = players.length >= 2
  const isCurrentPlayerRoomAdmin = room.adminId === player.id
  const admin = players.find((p) => p.id === room.adminId)

  const startGame = async () => {
    try {
      setIsWorking(true)

      await initGame({
        roomId: room.id,
        players,
        action: ACTIVITY_TYPE.INIT,
      })
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        title: 'Ups!',
        description: 'There was an error while starting the game. Try again.',
      })
    }
  }

  const updateRoomSettings = async (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      setIsWorking(true)

      await updateRoom({
        id: room.id,
        stepTime: Number(event.target.value),
      })
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        title: 'Ups!',
        description: 'There was an error updating the room. Try again.',
      })
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <Stack spacing="4">
      {!isCurrentPlayerRoomAdmin && (
        <AlertMessage
          status="info"
          title="Be prepared."
          description={`Waiting for ${admin.name} to start the game.`}
        />
      )}
      <FormControl
        id="roundTime"
        flex="1"
        isDisabled={room.adminId !== player.id}
      >
        <FormLabel>Round time</FormLabel>
        <Select
          flex="1"
          variant="filled"
          value={room.stepTime}
          onChange={updateRoomSettings}
        >
          <option value="60">1 minute</option>
          <option value="120">2 minutes</option>
          <option value="180">3 minutes</option>
        </Select>
      </FormControl>
      <Stack
        spacing="4"
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <CopyInviteLink text={`${window.location.origin}/${room.id}`} />
        <Button
          colorScheme="primary"
          onClick={startGame}
          disabled={!isCurrentPlayerRoomAdmin || !canPlay || isWorking}
          isLoading={isWorking}
          loadingText="Wait"
        >
          Start game
        </Button>
      </Stack>
    </Stack>
  )
}
