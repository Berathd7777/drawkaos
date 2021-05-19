export enum ROOM_STATUS {
  CREATED = 'CREATED',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export type Room = {
  id: string
  name: string
  adminId: string
  status: ROOM_STATUS
  step: number
}
