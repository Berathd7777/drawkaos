import { firestore, Timestamp } from 'firebase/init'

export function createPlayer({
  roomId,
  name,
}: {
  roomId: string
  name: string
}): Promise<{ id: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const playerRef = firestore
        .collection('rooms')
        .doc(roomId)
        .collection('players')
        .doc()

      await playerRef.set({
        name,
        createdAt: Timestamp.fromDate(new Date()),
      })

      resolve({ id: playerRef.id })
    } catch (error) {
      console.error(error)

      reject(error)
    }
  })
}
