import { FieldValue, firestore } from 'firebase/init'
import { REACTION_TYPE } from 'types/Reaction'

export function toggleReaction({
  resultId,
  playerId,
  reactionType,
}: {
  resultId: string
  reactionType: REACTION_TYPE
  playerId: string
}): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const resultRef = firestore.collection('reactions').doc(resultId)
      const resultData = (await resultRef.get()).data()
      const method = resultData[reactionType].find(
        (el) => el.playerId === playerId
      )
        ? FieldValue.arrayRemove
        : FieldValue.arrayUnion

      await resultRef.update({
        [reactionType]: method({ playerId }),
      })

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
