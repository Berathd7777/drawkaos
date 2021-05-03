import { Stack } from '@chakra-ui/react'
import { RoomProvider } from 'contexts/Room'
import { AccessRoom } from 'flows/room/AccessRoom'
import { PreviewRoom } from 'flows/room/PreviewRoom'
import { useRouter } from 'next/router'
import React from 'react'

function RoomId() {
  const router = useRouter()
  const roomId = Array.isArray(router.query.roomId)
    ? router.query.roomId[0]
    : router.query.roomId

  return (
    <RoomProvider roomId={roomId}>
      <Stack spacing="4">
        <PreviewRoom />
        {/* TODO: verify the room status */}
        <AccessRoom />
      </Stack>
    </RoomProvider>
  )
}

export default RoomId
