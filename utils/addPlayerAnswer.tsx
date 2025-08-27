import { supabase } from './initSupabase'
import { Player, RESULT_TYPE } from 'types/Player'
import { REACTION_TYPE } from 'types/Reaction'
import { ACTIVITY_TYPE, Room } from 'types/Room'
import { v4 as uuid } from 'uuid'

export async function addPlayerAnswer(
  room: Room,
  player: Player,
  type: RESULT_TYPE,
  value: string,
  step: number
): Promise<void> {
  try {
    const playerIdToUpdate = player.steps[step]
    const resultId = uuid()

    // 1. Reactions tablosuna ekle
    const { error: reactionError } = await supabase
      .from('reactions')
      .insert({
        id: resultId,
        love: [],
        smile: [],
        thumb_up: [],
        thumb_down: [],
      })

    if (reactionError) throw reactionError

    // 2. Player sonuçlarına ekle (JSON array append)
    const { error: playerError } = await supabase
      .from('players')
      .update({
        results: supabase.raw(
          `array_append(results, ?::jsonb)`,
          JSON.stringify({
            id: resultId,
            type,
            value,
            author: player.id,
          })
        ),
      })
      .eq('id', playerIdToUpdate)

    if (playerError) throw playerError

    // 3. Room aktivite alanına ekle
    const { error: roomError } = await supabase
      .from('rooms')
      .update({
        activity: supabase.raw(
          `array_append(activity, ?::jsonb)`,
          JSON.stringify({
            playerId: player.id,
            step,
            submittedAt: new Date().toISOString(),
            type: ACTIVITY_TYPE.REPLY,
          })
        ),
      })
      .eq('id', room.id)

    if (roomError) throw roomError
  } catch (error) {
    throw error
  }
}
