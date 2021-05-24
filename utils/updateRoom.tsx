import { firestore } from 'firebase/init'
import { Room } from 'types/Room'

export function updateRoom({
  id,
  ...roomData
}: Pick<Room, 'id'> & Partial<Room>): Promise<boolean | Error> {
  return new Promise(async (resolve, reject) => {
    try {
      const batch = firestore.batch()
      const roomRef = firestore.collection('rooms').doc(id)

      batch.update(roomRef, roomData)

      await batch.commit()

      resolve(true)
    } catch (error) {
      console.error(error)

      reject(error)
    }
  })
}
