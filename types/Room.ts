export enum ROOM_STATUS {
  CREATED = 'CREATED',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export enum ACTIVITY_TYPE {
  INIT = 'INIT',
  REPLY = 'REPLY',
  FINISHED = 'FINISHED',
}

type RoomActivityInit = {
  type: ACTIVITY_TYPE.INIT
}

type RoomActivityReply = {
  type: ACTIVITY_TYPE.REPLY
  playerId: string
  step: number
}

export type RoomActivity = RoomActivityInit | RoomActivityReply

export type Room = {
  id: string
  name: string
  adminId: string
  activity: RoomActivity[]
}
