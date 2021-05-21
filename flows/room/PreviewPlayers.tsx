import { Heading, IconButton, Stack, Tag, Text } from '@chakra-ui/react'
import { Avatar } from 'components/Avatar'
import { usePlayer } from 'contexts/Player'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useToasts } from 'hooks/useToasts'
import React from 'react'
import { MdDelete } from 'react-icons/md'
import { Player } from 'types/Player'
import { removePlayer } from 'utils/removePlayer'

export function PreviewPlayers() {
  const { showToast } = useToasts()
  const room = useRoom()
  const currentPlayer = usePlayer()
  const players = usePlayers()

  const onRemovePlayer = async (userId: string) => {
    try {
      await removePlayer(room.id, userId)
    } catch (error) {
      showToast({
        status: 'error',
        title: 'Ups!',
        description: 'There was an error',
      })

      console.error(error)
    }
  }

  return (
    <Stack spacing="4">
      <Heading as="h2" fontSize="xl">
        Players ({players.length})
      </Heading>
      {Boolean(players.length) &&
        players.map((player) => {
          const isCurrentPlayer = currentPlayer.id === player.id

          return (
            <PlayerRow
              key={player.id}
              {...player}
              isAdmin={room.adminId === player.id}
              isCurrentPlayer={isCurrentPlayer}
              onRemovePlayer={
                room.adminId === currentPlayer.id && !isCurrentPlayer
                  ? () => onRemovePlayer(player.id)
                  : null
              }
            />
          )
        })}
    </Stack>
  )
}

type PlayerProps = Player & {
  isAdmin: boolean
  isCurrentPlayer: boolean
  onRemovePlayer?: () => void
}

function PlayerRow({
  name,
  isAdmin,
  isCurrentPlayer,
  onRemovePlayer,
}: PlayerProps) {
  return (
    <Stack spacing="4" direction="row" alignItems="center">
      <Avatar seed={name} />
      <Text>{isCurrentPlayer ? 'You' : name}</Text>
      {isAdmin && <Tag colorScheme="tertiary">Admin</Tag>}
      {onRemovePlayer && (
        <IconButton
          aria-label="Remove player"
          colorScheme="red"
          variant="link"
          icon={<MdDelete />}
          onClick={() => {
            onRemovePlayer()
          }}
        />
      )}
    </Stack>
  )
}
