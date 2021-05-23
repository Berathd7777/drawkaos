import { firestore } from 'firebase/init'
import { useEffect, useState } from 'react'
import { REACTION_TYPE } from 'types/Reaction'

export const DEFAULT_REACTIONS = {
  love: 0,
  smile: 0,
  plusOne: 0,
  thumbDown: 0,
}

export type Reactions = {
  love: number
  smile: number
  plusOne: number
  thumbDown: number
}

export function useReactions(resultId: string) {
  const [reactions, setReactions] = useState<Reactions>(DEFAULT_REACTIONS)

  useEffect(() => {
    if (!resultId) return

    setReactions(DEFAULT_REACTIONS)

    const unsubscribe = firestore
      .collection('reactions')
      .doc(resultId)
      .onSnapshot(
        (snapshot) => {
          const reactionsData = snapshot.data()

          setReactions({
            love: reactionsData[REACTION_TYPE.LOVE].length,
            smile: reactionsData[REACTION_TYPE.SMILE].length,
            plusOne: reactionsData[REACTION_TYPE.PLUS_ONE].length,
            thumbDown: reactionsData[REACTION_TYPE.THUMB_DOWN].length,
          })
        },
        (error) => {
          console.error(error)
        }
      )

    return unsubscribe
  }, [resultId])

  return reactions
}
