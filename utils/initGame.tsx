import { firestore, Timestamp } from 'firebase/init'
import { knuthShuffle } from 'knuth-shuffle'
import { Player } from 'types/Player'
import { ACTIVITY_TYPE } from 'types/Room'

export function initGame({
  roomId,
  players,
  action,
}: {
  roomId: string
  players: Player[]
  action: ACTIVITY_TYPE.INIT | 'RESET'
}): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const batch = firestore.batch()
      const roomRef = firestore.collection('rooms').doc(roomId)

      const activity =
        action === 'RESET'
          ? []
          : [{ type: ACTIVITY_TYPE.INIT, submittedAt: Timestamp.now() }]

      batch.update(roomRef, {
        activity,
        albumIndex: null,
      })

      const game = getGameOrder(players)

      players.map((player) => {
        const playerRef = firestore
          .collection('rooms')
          .doc(roomId)
          .collection('players')
          .doc(player.id)

        const firstStep = game[0]
        const order = firstStep.indexOf(player.id)
        const steps = [player.id].concat(
          game.slice(1).map((line) => firstStep[line.indexOf(player.id)])
        )

        batch.update(playerRef, {
          order,
          steps,
          results: [],
        })
      })

      await batch.commit()

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

function getGameOrder(players: Player[]) {
  const ids = players.map(({ id }) => id)

  const lines = ids.reduce((acc, currId, currIdx, arr) => {
    const others = [...arr.slice(currIdx + 1), ...arr.slice(0, currIdx)]
    const line = [currId, ...others]

    return [...acc, line]
  }, [])

  const linesAmount = lines.length
  const shuffledRowIndexes = knuthShuffle([...Array(linesAmount).keys()])
  const shuffledLines = lines.reduce((acc, curr, currIdx) => {
    acc[shuffledRowIndexes[currIdx]] = curr

    return acc
  }, [])

  const columnsAmount = lines[0].length
  const shuffledColumnIndexes = knuthShuffle([...Array(columnsAmount).keys()])
  const shuffledColumns = shuffledLines.reduce((acc, curr, currIdx) => {
    acc[currIdx] = shuffledColumnIndexes.map((n) => curr[n])

    return acc
  }, [])

  return shuffledColumns as string[][]
}
