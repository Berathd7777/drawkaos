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
    /* TODO: use a batch */
    try {
      const playerIdToUpdate = player.steps[step]

      const playerRef = firestore
        .collection('rooms')
        .doc(room.id)
        .collection('players')
        .doc(playerIdToUpdate)

      const resultId = uuid()

      firestore
        .collection('reactions')
        .doc(resultId)
        .set({
          [REACTION_TYPE.LOVE]: [],
          [REACTION_TYPE.SMILE]: [],
          [REACTION_TYPE.PLUS_ONE]: [],
          [REACTION_TYPE.THUMB_DOWN]: [],
        })

      await playerRef.update({
        results: FieldValue.arrayUnion({
          id: resultId,
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
