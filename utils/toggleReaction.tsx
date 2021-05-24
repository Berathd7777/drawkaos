import { FieldValue, firestore } from 'firebase/init'
import { PlayersReaction } from 'hooks/useReactions'
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
      const batch = firestore.batch()
      const resultRef = firestore.collection('reactions').doc(resultId)
      const resultData = (await resultRef.get()).data()
      const method = (resultData[reactionType] as PlayersReaction[]).find(
        (el) => el.playerId === playerId
      )
        ? FieldValue.arrayRemove
        : FieldValue.arrayUnion

      batch.update(resultRef, {
        [reactionType]: method({ playerId }),
      })

      await batch.commit()

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
