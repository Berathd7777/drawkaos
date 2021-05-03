import { useRoom } from 'contexts/Room'
import React from 'react'

export function PreviewRoom() {
  const { state } = useRoom()

  return (
    <pre>
      <code>{JSON.stringify(state, null, 2)}</code>
    </pre>
  )
}
