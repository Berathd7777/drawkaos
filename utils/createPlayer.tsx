import { firestore } from 'firebase/init'

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
        order: 0,
        steps: [],
        results: [],
      })

      resolve({ id: playerRef.id })
    } catch (error) {
      reject(error)
    }
  })
}
