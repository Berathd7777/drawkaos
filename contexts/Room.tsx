import { firestore } from 'firebase/init'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { RemoteData, REMOTE_DATA } from 'types/RemoteData'
import { Room } from 'types/Room'

const RoomContext = createContext<{
  state: RemoteData<Room>
}>({
  state: { type: REMOTE_DATA.IDLE },
})

interface Props {
  children: ReactNode
  roomId: string
}

const RoomProvider = ({ children, roomId }: Props) => {
  const [state, setState] = useState<RemoteData<Room>>({
    type: REMOTE_DATA.IDLE,
  })

  useEffect(() => {
    if (!roomId) return

    setState({ type: REMOTE_DATA.LOADING })

    const unsubscribe = firestore
      .collection('rooms')
      .doc(roomId)
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.exists) {
            setState({
              type: REMOTE_DATA.ERROR,
              error: 'ROOM_DELETED',
            })

            return
          }

          const roomData = snapshot.data() as Room
          const room = {
            ...roomData,
            id: snapshot.id,
          }

          setState({ type: REMOTE_DATA.SUCCESS, data: room })
        },
        (error) => {
          console.error(error)

          setState({ type: REMOTE_DATA.ERROR, error: 'ROOM_LOADING_ERROR' })
        }
      )

    return unsubscribe
  }, [roomId])

  return (
    <RoomContext.Provider value={{ state }}>{children}</RoomContext.Provider>
  )
}

function useRoom() {
  const context = useContext(RoomContext)

  if (!context) {
    throw new Error('useRoom must be used within a <RoomProvider />')
  }

  return context
}

export { RoomProvider, useRoom }
