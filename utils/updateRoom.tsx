import { firestore } from 'firebase/init'
import { Room } from 'types/Room'

export function updateRoom({
  id,
  ...roomData
}: Pick<Room, 'id'> & Partial<Room>): Promise<boolean | Error> {
  return new Promise(async (resolve, reject) => {
    try {
      const roomRef = firestore.collection('rooms').doc(id)

      await roomRef.update(roomData)

      resolve(true)
    } catch (error) {
      console.error(error)

      reject(error)
    }
  })
}
