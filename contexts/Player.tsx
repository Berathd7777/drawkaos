import { firestore } from 'firebase/init'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Player } from 'types/Player'
import { REMOTE_DATA } from 'types/RemoteData'

type PlayerContextState = {
  status: REMOTE_DATA
  error: string
  data: Player
}

const PlayerContext = createContext<PlayerContextState>(undefined)

interface Props {
  children: ReactNode
  roomId: string
  playerId: string
}

const PlayerProvider = ({ children, roomId, playerId }: Props) => {
  const [state, setState] = useState<PlayerContextState>({
    status: REMOTE_DATA.IDLE,
    error: null,
    data: null,
  })

  useEffect(() => {
    if (!roomId || !playerId) return

    setState({ status: REMOTE_DATA.LOADING, error: null, data: null })

    const unsubscribe = firestore
      .collection('rooms')
      .doc(roomId)
      .collection('players')
      .doc(playerId)
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.exists) {
            setState({
              status: REMOTE_DATA.ERROR,
              error: 'PLAYER_DELETED',
              data: null,
            })

            return
          }

          const playerData = snapshot.data() as Player
          const player = {
            ...playerData,
            id: snapshot.id,
          }

          setState({ status: REMOTE_DATA.SUCCESS, error: null, data: player })
        },
        (error) => {
          console.error(error)

          setState({
            status: REMOTE_DATA.ERROR,
            error: 'PLAYER_LOADING_ERROR',
            data: null,
          })
        }
      )

    return unsubscribe
  }, [roomId, playerId])

  return (
    <PlayerContext.Provider value={state}>{children}</PlayerContext.Provider>
  )
}

function usePlayer() {
  const context = useContext(PlayerContext)

  if (!context) {
    throw new Error('usePlayer must be used within a <PlayerProvider />')
  }

  return context
}

export { PlayerProvider, usePlayer }
