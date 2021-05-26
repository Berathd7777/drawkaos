export const SCROLLBAR_WIDTH = 12
export const CONTAINER_PADDING = 16 * 2
export const MAX_WIDTH = 1024 - SCROLLBAR_WIDTH

export const LAYOUT_WIDTH = `${MAX_WIDTH}px`
export const CONTAINER_WIDTH = `${
  MAX_WIDTH + SCROLLBAR_WIDTH - CONTAINER_PADDING
}px`

export const CANVAS_WIDTH = MAX_WIDTH - 316
export const CANVAS_HEIGHT = Math.floor(CANVAS_WIDTH * (9 / 16))
