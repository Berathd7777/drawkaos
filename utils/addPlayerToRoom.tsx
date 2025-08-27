import { supabase } from './initSupabase'

export async function addPlayerToRoom({
  roomId,
  name,
}: {
  roomId: string
  name: string
}): Promise<{ id: string }> {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert({
        room_id: roomId,
        name,
        order: 0,
        steps: [],
        results: [],
      })
      .select('id')
      .single()

    if (error) throw error

    return { id: data.id }
  } catch (error) {
    throw error
  }
}
