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

type PlayersContextState = {
  status: REMOTE_DATA
  error: string
  players: Player[]
}

const PlayersContext = createContext<PlayersContextState>(undefined)

interface Props {
  children: ReactNode
  roomId: string
}

const PlayersProvider = ({ children, roomId }: Props) => {
  const [state, setState] = useState<PlayersContextState>({
    status: REMOTE_DATA.IDLE,
    error: null,
    players: null,
  })

  useEffect(() => {
    if (!roomId) {
      return
    }

    setState({ status: REMOTE_DATA.LOADING, error: null, players: null })

    const unsubscribe = firestore
      .collection('rooms')
      .doc(roomId)
      .collection('players')
      .onSnapshot(
        (snapshot) => {
          const players = snapshot.docs
            .filter((p) => p.exists)
            .map((p) => {
              const playerData = p.data() as Player

              return {
                ...playerData,
                id: p.id,
              }
            })
            .sort((p1, p2) => p1.name.localeCompare(p2.name))

          setState({
            status: REMOTE_DATA.SUCCESS,
            error: null,
            players: players,
          })
        },
        (error) => {
          console.error(error)

          setState({
            status: REMOTE_DATA.ERROR,
            error: 'PLAYERS_LOADING_ERROR',
            players: null,
          })
        }
      )

    return unsubscribe
  }, [roomId])

  return (
    <PlayersContext.Provider value={state}>
      <Async
        errorMessage="There was an error getting the players."
        status={state.status}
      >
        {children}
      </Async>
    </PlayersContext.Provider>
  )
}

function usePlayers() {
  const context = useContext(PlayersContext)

  if (!context) {
    throw new Error('usePlayers must be used within <PlayersProvider />.')
  }

  return context.players
}

export { PlayersProvider, usePlayers }
