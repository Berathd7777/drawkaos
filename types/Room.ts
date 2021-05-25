export enum ROOM_STATUS {
  CREATED = 'CREATED',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export enum ACTIVITY_TYPE {
  INIT = 'INIT',
  REPLY = 'REPLY',
}

type RoomActivityInit = {
  type: ACTIVITY_TYPE.INIT
  submittedAt: Date
}

export type RoomActivityReply = {
  type: ACTIVITY_TYPE.REPLY
  playerId: string
  step: number
  submittedAt: Date
}

export type RoomActivity = RoomActivityInit | RoomActivityReply

export type Room = {
  id: string
  name: string
  adminId: string
  activity: RoomActivity[]
  stepTime: number
  albumIndex: null | number
}
