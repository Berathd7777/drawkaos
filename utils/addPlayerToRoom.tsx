import { firestore } from 'firebase/init'

export function addPlayerToRoom({
  roomId,
  name,
  appendToBatch,
}: {
  roomId: string
  name: string
  appendToBatch?: firebase.default.firestore.WriteBatch
}): Promise<{ id: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const batch = appendToBatch || firestore.batch()
      const playerRef = firestore
        .collection('rooms')
        .doc(roomId)
        .collection('players')
        .doc()

      batch.set(playerRef, {
        name,
        order: 0,
        steps: [],
        results: [],
      })

      if (!appendToBatch) {
        await batch.commit()
      }

      resolve({ id: playerRef.id })
    } catch (error) {
      reject(error)
    }
  })
}
