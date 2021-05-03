import {
  Alert,
  AlertIcon,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react'
import { usePlayers } from 'contexts/Players'
import React from 'react'
import { MdDelete } from 'react-icons/md'
import { Player } from 'types/Player'
import { REMOTE_DATA } from 'types/RemoteData'

type Props = {
  adminId: string
}

export function PreviewPlayers({ adminId }: Props) {
  const { status, error, data } = usePlayers()

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
    <Stack spacing="4">
      <Heading>Players ({data.length})</Heading>
      {Boolean(data.length) &&
        data.map((player) => (
          <PlayerRow
            key={player.id}
            isAdmin={player.id === adminId}
            {...player}
          />
        ))}
    </Stack>
  )
}

type PlayerProps = Player & {
  isAdmin: boolean
}

function PlayerRow({ isAdmin, name, id }: PlayerProps) {
  return (
    <Stack spacing="4" direction="row" alignItems="center">
      <Text>{name}</Text>
      {isAdmin && <Tag colorScheme="green">Admin</Tag>}
      {!isAdmin && (
        <IconButton
          aria-label="Remove player"
          icon={<MdDelete />}
          onChange={() => {
            console.log('Remove player', id)
          }}
        />
      )}
    </Stack>
  )
}
