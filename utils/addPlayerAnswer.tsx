import { FieldValue, firestore, Timestamp } from 'firebase/init'
import { Player, RESULT_TYPE } from 'types/Player'
import { ACTIVITY_TYPE, Room } from 'types/Room'

export function addPlayerAnswer(
  room: Room,
  player: Player,
  type: RESULT_TYPE,
  value: string,
  step: number
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const playerIdToUpdate = player.steps[step]

      const playerRef = firestore
        .collection('rooms')
        .doc(room.id)
        .collection('players')
        .doc(playerIdToUpdate)

      await playerRef.update({
        results: FieldValue.arrayUnion({
          type,
          value,
          author: player.id,
        }),
      })

      const roomRef = firestore.collection('rooms').doc(room.id)

      await roomRef.update({
        activity: FieldValue.arrayUnion({
          playerId: player.id,
          step,
          submittedAt: Timestamp.now(),
          type: ACTIVITY_TYPE.REPLY,
        }),
      })

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
