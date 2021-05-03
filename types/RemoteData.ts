export enum REMOTE_DATA {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export type RemoteData<T> =
  | { type: REMOTE_DATA.IDLE }
  | { type: REMOTE_DATA.LOADING }
  | { type: REMOTE_DATA.ERROR; error: string }
  | { type: REMOTE_DATA.SUCCESS; data: T }
