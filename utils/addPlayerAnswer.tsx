import { FieldValue, firestore, Timestamp } from 'firebase/init'
import { Player, RESULT_TYPE } from 'types/Player'
import { REACTION_TYPE } from 'types/Reaction'
import { ACTIVITY_TYPE, Room } from 'types/Room'
import { v4 as uuid } from 'uuid'

export function addPlayerAnswer(
  room: Room,
  player: Player,
  type: RESULT_TYPE,
  value: string,
  step: number
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const batch = firestore.batch()
      const playerIdToUpdate = player.steps[step]

      const playerRef = firestore
        .collection('rooms')
        .doc(room.id)
        .collection('players')
        .doc(playerIdToUpdate)

      const resultId = uuid()
      const resultRef = firestore.collection('reactions').doc(resultId)

      batch.set(resultRef, {
        [REACTION_TYPE.LOVE]: [],
        [REACTION_TYPE.SMILE]: [],
        [REACTION_TYPE.THUMB_UP]: [],
        [REACTION_TYPE.THUMB_DOWN]: [],
      })

      batch.update(playerRef, {
        results: FieldValue.arrayUnion({
          id: resultId,
          type,
          value,
          author: player.id,
        }),
      })

      const roomRef = firestore.collection('rooms').doc(room.id)

      batch.update(roomRef, {
        activity: FieldValue.arrayUnion({
          playerId: player.id,
          step,
          submittedAt: Timestamp.now(),
          type: ACTIVITY_TYPE.REPLY,
        }),
      })

      await batch.commit()

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
