import { Async } from 'components/Async'
import { firestore } from 'firebase/init'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { REMOTE_DATA } from 'types/RemoteData'
import { Room } from 'types/Room'

type RoomContextState = {
  status: REMOTE_DATA
  error: string
  room: Room
}

const RoomContext = createContext<RoomContextState>(undefined)

interface Props {
  children: ReactNode
  roomId: string
}

const RoomProvider = ({ children, roomId }: Props) => {
  const [state, setState] = useState<RoomContextState>({
    status: REMOTE_DATA.IDLE,
    error: null,
    room: null,
  })

  useEffect(() => {
    if (!roomId) return

    setState({
      status: REMOTE_DATA.LOADING,
      error: null,
      room: null,
    })

    const unsubscribe = firestore
      .collection('rooms')
      .doc(roomId)
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.exists) {
            setState({
              status: REMOTE_DATA.ERROR,
              error: 'ROOM_DELETED',
              room: null,
            })

            return
          }

          const roomData = snapshot.data() as Room
          const room = {
            ...roomData,
            id: snapshot.id,
          }

          setState({ status: REMOTE_DATA.SUCCESS, error: null, room })
        },
        (error) => {
          console.error(error)

          setState({
            status: REMOTE_DATA.ERROR,
            error: 'ROOM_LOADING_ERROR',
            room: null,
          })
        }
      )

    return unsubscribe
  }, [roomId])

  return (
    <RoomContext.Provider value={state}>
      <Async
        errorMessage="There was an error getting the room"
        status={state.status}
      >
        {children}
      </Async>
    </RoomContext.Provider>
  )
}

function useRoom() {
  const context = useContext(RoomContext)

  if (!context) {
    throw new Error('useRoom must be used within <RoomProvider />')
  }

  return context.room
}

export { RoomProvider, useRoom }
