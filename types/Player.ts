export enum RESULT_TYPE {
  SENTENCE = 'SENTENCE',
  DRAW = 'DRAW',
}

export type Result = {
  type: RESULT_TYPE
  author: string
  value: string
}

export type Player = {
  id: string
  name: string
  order: number
  steps: string[]
  results: Result[]
}
