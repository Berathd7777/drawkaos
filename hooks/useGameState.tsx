import { usePlayers } from 'contexts/Players'
import { useRoom } from 'contexts/Room'
import { useMemo } from 'react'
import { ACTIVITY_TYPE, ROOM_STATUS } from 'types/Room'

export type GameState = {
  step: number
  status: ROOM_STATUS
}

export function useGameState(): GameState {
  const room = useRoom()
  const players = usePlayers()

  const playersLenght = players.length

  const step = useMemo(() => {
    const activityLenght = room.activity.length - 1

    return Math.floor(activityLenght / playersLenght)
  }, [room, playersLenght])

  const status = useMemo(() => {
    const gameHasStarted =
      room.activity.findIndex(
        (activity) => activity.type === ACTIVITY_TYPE.INIT
      ) !== -1

    if (!gameHasStarted) {
      return ROOM_STATUS.CREATED
    }

    return step === playersLenght ? ROOM_STATUS.FINISHED : ROOM_STATUS.PLAYING
  }, [room, step, playersLenght])

  return {
    step,
    status,
  }
}
