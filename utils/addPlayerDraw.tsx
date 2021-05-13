import { FieldValue, firestore } from 'firebase/init'
import { Player, RESULT_TYPE } from 'types/Player'
import { Room } from 'types/Room'

export function addPlayerDraw(
  room: Room,
  player: Player,
  url: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const playerIdToUpdate = player.steps[room.step]

      const playerRef = firestore
        .collection('rooms')
        .doc(room.id)
        .collection('players')
        .doc(playerIdToUpdate)

      await playerRef.update({
        results: FieldValue.arrayUnion({
          type: RESULT_TYPE.DRAW,
          author: player.id,
          value: url,
        }),
      })

      resolve()
    } catch (error) {
      console.error(error)

      reject('Error updating player with the draw')
    }
  })
}
