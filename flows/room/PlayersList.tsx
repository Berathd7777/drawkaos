import {
  Divider,
  Heading,
  IconButton,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react'
import { Avatar } from 'components/Avatar'
import { usePlayer } from 'contexts/Player'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'contexts/Toasts'
import React from 'react'
import { MdDelete } from 'react-icons/md'
import { Player } from 'types/Player'
import { removePlayer } from 'utils/removePlayer'

export function PlayersList() {
  const { showToast } = useToasts()
  const room = useRoom()
  const currentPlayer = usePlayer()
  const players = usePlayers()

  const isCurrentPlayerRoomAdmin = room.adminId === currentPlayer.id

  const onRemovePlayer = async (userId: string) => {
    try {
      await removePlayer(room.id, userId)
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        title: 'Ups!',
        description: 'There was an error while removing the player. Try again.',
      })
    }
  }

  return (
    <Stack spacing="4">
      <Heading fontSize="xl" textAlign="center">
        Players ({players.length})
      </Heading>
      <Divider />
      {Boolean(players.length) &&
        players.map((player) => (
          <PlayerRow
            key={player.id}
            {...player}
            isRoomAdmin={room.adminId === player.id}
            onRemovePlayer={
              isCurrentPlayerRoomAdmin && currentPlayer.id !== player.id
                ? () => onRemovePlayer(player.id)
                : null
            }
          />
        ))}
    </Stack>
  )
}

type PlayerProps = Player & {
  isRoomAdmin: boolean
  onRemovePlayer?: () => void
}

function PlayerRow({ name, isRoomAdmin, onRemovePlayer }: PlayerProps) {
  return (
    <Stack spacing="4" direction="row" alignItems="center">
      <Avatar seed={name} />
      <Text flex="1" isTruncated>
        {name}
      </Text>
      {isRoomAdmin && <Tag colorScheme="primary">Admin</Tag>}
      {onRemovePlayer && (
        <IconButton
          aria-label="Remove player"
          colorScheme="red"
          variant="ghost"
          icon={<MdDelete />}
          onClick={() => {
            onRemovePlayer()
          }}
        />
      )}
    </Stack>
  )
}
