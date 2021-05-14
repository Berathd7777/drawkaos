import { FieldValue, firestore } from 'firebase/init'
import { Player, RESULT_TYPE } from 'types/Player'
import { Room, ROOM_STATUS } from 'types/Room'
import { updateRoom } from './updateRoom'

export function addPlayerAnswer(
  room: Room,
  player: Player,
  type: RESULT_TYPE,
  value: string
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
          type,
          author: player.id,
          value,
        }),
      })

      if (player.id === room.adminId) {
        const nextStep = room.step + 1
        const status =
          nextStep === player.steps.length
            ? ROOM_STATUS.FINISHED
            : ROOM_STATUS.PLAYING

        await updateRoom({
          id: room.id,
          step: nextStep,
          status,
        })
      }

      resolve()
    } catch (error) {
      console.error(error)

      reject('Error updating player with the answer')
    }
  })
}
