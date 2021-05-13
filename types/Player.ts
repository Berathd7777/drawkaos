export enum RESULT_TYPE {
  SENTENCE = 'SENTENCE',
  DRAW = 'DRAW',
}

export type Player = {
  id: string
  name: string
  order: number
  steps: string[]
  results: RESULT_TYPE
}
