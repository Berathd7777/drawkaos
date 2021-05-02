import { useRouter } from 'next/dist/client/router'
import React from 'react'

function PlayerId() {
  const router = useRouter()
  const { roomId, playerId } = router.query

  return (
    <pre>
      <code>
        {JSON.stringify(
          {
            roomId,
            playerId,
          },
          null,
          2
        )}
      </code>
    </pre>
  )
}

export default PlayerId
