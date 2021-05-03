import { RoomProvider } from 'contexts/Room'
import { PreviewRoom } from 'flows/room/PreviewRoom'
import { useRouter } from 'next/router'
import React from 'react'

function PlayerId() {
  const router = useRouter()
  const roomId = Array.isArray(router.query.roomId)
    ? router.query.roomId[0]
    : router.query.roomId

  return (
    <RoomProvider roomId={roomId}>
      <PreviewRoom />
    </RoomProvider>
  )
}

export default PlayerId
