import { firestore } from 'firebase/init'
import { addPlayerToRoom } from 'utils/addPlayerToRoom'

export function createRoom({
  adminName,
}: {
  adminName: string
}): Promise<{ roomId: string; adminId: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const batch = firestore.batch()
      const roomRef = firestore.collection('rooms').doc()
      const roomId = roomRef.id

      const adminRef = await addPlayerToRoom({
        roomId,
        name: adminName,
        appendToBatch: batch,
      })
      const adminId = adminRef.id

      batch.set(roomRef, {
        adminId,
        activity: [],
        stepTime: 120,
        albumIndex: null,
      })

      await batch.commit()

      resolve({ roomId, adminId })
    } catch (error) {
      reject(error)
    }
  })
}
