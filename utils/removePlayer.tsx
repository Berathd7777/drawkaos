import { firestore } from 'firebase/init'

export function removePlayer(roomId: string, playerId: string) {
  return firestore
    .collection('rooms')
    .doc(roomId)
    .collection('players')
    .doc(playerId)
    .delete()
}
