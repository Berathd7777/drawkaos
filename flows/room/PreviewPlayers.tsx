import {
  Alert,
  AlertIcon,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react'
import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import React from 'react'
import { MdDelete } from 'react-icons/md'
import { Player } from 'types/Player'
import { REMOTE_DATA } from 'types/RemoteData'
import { removePlayer } from 'utils/removePlayer'

type Props = {
  playerId: string
}

export function PreviewPlayers({ playerId }: Props) {
  const toast = useToast()
  const { status, error, data } = usePlayers()
  const { data: room, status: roomStatus, error: roomError } = useRoom()

  if (
    (status || roomStatus) === REMOTE_DATA.IDLE ||
    (status || roomStatus) === REMOTE_DATA.LOADING
  ) {
    return <Spinner />
  }

  if ((status || roomError) === REMOTE_DATA.ERROR) {
    return (
      <Alert status="error">
        <AlertIcon />
        There was an error while getting the players ({error})
      </Alert>
    )
  }

  const onRemovePlayer = async (roomId: string, userId: string) => {
    try {
      await removePlayer(roomId, userId)
    } catch (error) {
      toast({
        title: 'Error',
        status: 'error',
      })

      console.error(error)
    }
  }

  /* TODO: hack */
  if (!room) {
    return null
  }

  return (
    <Stack spacing="4">
      <Heading>Players ({data.length})</Heading>
      {Boolean(data.length) &&
        data.map((player) => (
          <PlayerRow
            key={player.id}
            adminId={room.adminId}
            isAdmin={playerId === room.adminId}
            playerId={playerId}
            onRemovePlayer={() => {
              onRemovePlayer(room.id, player.id)
            }}
            {...player}
          />
        ))}
    </Stack>
  )
}

type PlayerProps = Player & {
  isAdmin: boolean
  adminId: string
  playerId: string
  onRemovePlayer: () => void
}

function PlayerRow({
  name,
  id,
  adminId,
  isAdmin,
  playerId,
  onRemovePlayer,
}: PlayerProps) {
  return (
    <Stack spacing="4" direction="row" alignItems="center">
      {isAdmin && id !== adminId && (
        <IconButton
          aria-label="Remove player"
          icon={<MdDelete />}
          onClick={() => {
            onRemovePlayer()
          }}
        />
      )}
      <Text>{name}</Text>
      {id === playerId && <Text>(You)</Text>}
      {id === adminId && <Tag colorScheme="green">Admin</Tag>}
    </Stack>
  )
}
