import { firestore } from 'firebase/init'
import { Player } from 'types/Player'
import { ROOM_STATUS } from 'types/Room'

export function initGame({
  roomId,
  game,
  players,
}: {
  roomId: string
  game: string[][]
  players: Player[]
}): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const batch = firestore.batch()
      const roomRef = firestore.collection('rooms').doc(roomId)

      batch.update(roomRef, {
        status: ROOM_STATUS.PLAYING,
        /* we save this just for the record */
        game: JSON.stringify(game),
      })

      players.map((player) => {
        const playerRef = firestore
          .collection('rooms')
          .doc(roomId)
          .collection('players')
          .doc(player.id)

        const firstStep = game[0]
        const order = firstStep.indexOf(player.id)
        const steps = game
          .map((step) => step[order])
          .filter((playerId) => playerId !== player.id)
          .concat([player.id])

        batch.update(playerRef, {
          order,
          steps,
          results: [],
        })
      })

      await batch.commit()

      resolve()
    } catch (error) {
      console.error(error)

      reject(error)
    }
  })
}
