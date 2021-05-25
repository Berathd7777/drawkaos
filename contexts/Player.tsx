import { Async } from 'components/Async'
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
  player: Player
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
    player: null,
  })

  useEffect(() => {
    if (!roomId || !playerId) {
      return
    }

    setState({ status: REMOTE_DATA.LOADING, error: null, player: null })

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
              player: null,
            })

            return
          }

          const playerData = snapshot.data() as Player
          const player = {
            ...playerData,
            id: snapshot.id,
          }

          setState({ status: REMOTE_DATA.SUCCESS, error: null, player })
        },
        (error) => {
          console.error(error)

          setState({
            status: REMOTE_DATA.ERROR,
            error: 'PLAYER_LOADING_ERROR',
            player: null,
          })
        }
      )

    return unsubscribe
  }, [roomId, playerId])

  return (
    <PlayerContext.Provider value={state}>
      <Async
        errorMessage="There was an error getting the player."
        status={state.status}
      >
        {children}
      </Async>
    </PlayerContext.Provider>
  )
}

function usePlayer() {
  const context = useContext(PlayerContext)

  if (!context) {
    throw new Error('usePlayer must be used within <PlayerProvider />.')
  }

  return context.player
}

export { PlayerProvider, usePlayer }
