export enum RESULT_TYPE {
  SENTENCE = 'SENTENCE',
  DRAW = 'DRAW',
}

export type Result = {
  type: RESULT_TYPE
  value: string
  author: string
}

export type Player = {
  id: string
  name: string
  order: number
  steps: string[]
  results: Result[]
}
