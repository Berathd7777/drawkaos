import { PlayersProvider } from 'contexts/Players'
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
      <PlayersProvider roomId={roomId}>
        <PreviewRoom />
        <AccessRoom />
      </PlayersProvider>
    </RoomProvider>
  )
}

export default RoomId
