import { firestore } from 'firebase/init'
import { useEffect, useState } from 'react'
import { REACTION_TYPE } from 'types/Reaction'

const DEFAULT_REACTIONS = {
  love: 0,
  smile: 0,
  thumbUp: 0,
  thumbDown: 0,
}

const DEFAULT_USER_REACTIONS = {
  love: false,
  smile: false,
  thumbUp: false,
  thumbDown: false,
}

type Reactions = {
  love: number
  smile: number
  thumbUp: number
  thumbDown: number
}

type UserReactions = {
  love: boolean
  smile: boolean
  thumbUp: boolean
  thumbDown: boolean
}

export type PlayersReaction = { playerId: string }

type FirebaseReactions = {
  [key in REACTION_TYPE]: PlayersReaction[]
}

export function useReactions(playerId: string, resultId: string) {
  const [reactions, setReactions] = useState<Reactions>(DEFAULT_REACTIONS)
  const [userReactions, setUserReactions] = useState<UserReactions>(
    DEFAULT_USER_REACTIONS
  )

  useEffect(() => {
    if (!playerId || !resultId) {
      return
    }

    setReactions(DEFAULT_REACTIONS)

    const unsubscribe = firestore
      .collection('reactions')
      .doc(resultId)
      .onSnapshot(
        (snapshot) => {
          const reactionsData = snapshot.data() as FirebaseReactions

          const loveArr = reactionsData.LOVE
          const smileArr = reactionsData.SMILE
          const thumbUpArr = reactionsData.THUMB_UP
          const thumbDownArr = reactionsData.THUMB_DOWN

          setReactions({
            love: loveArr.length,
            smile: smileArr.length,
            thumbUp: thumbUpArr.length,
            thumbDown: thumbDownArr.length,
          })

          setUserReactions({
            love: !!loveArr.find((r) => r.playerId === playerId),
            smile: !!smileArr.find((r) => r.playerId === playerId),
            thumbUp: !!thumbUpArr.find((r) => r.playerId === playerId),
            thumbDown: !!thumbDownArr.find((r) => r.playerId === playerId),
          })
        },
        (error) => {
          console.error(error)
        }
      )

    return unsubscribe
  }, [playerId, resultId])

  return { reactions, userReactions }
}
