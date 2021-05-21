import { createCanvas, loadImage, registerFont } from 'canvas'
import GIFEncoder from 'gif-encoder-2'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { Result, RESULT_TYPE } from 'types/Player'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from 'utils/constants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed',
    })

    return
  }

  const GIF_WIDTH = CANVAS_WIDTH * 1.25
  const GIT_HEIGHT = CANVAS_HEIGHT * 1.25

  const encoder = new GIFEncoder(GIF_WIDTH, GIT_HEIGHT)
  encoder.setDelay(3000)
  encoder.start()

  registerFont(path.resolve('./public/Inter-Regular.ttf'), {
    family: 'Inter',
  })

  const canvas = createCanvas(GIF_WIDTH, GIT_HEIGHT)
  const ctx = canvas.getContext('2d')

  const answers: Result[] = JSON.parse(req.body)

  await processArray(
    answers,
    (answer, index) =>
      new Promise(async (resolve) => {
        ctx.clearRect(0, 0, GIF_WIDTH, GIT_HEIGHT)

        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, GIF_WIDTH, GIT_HEIGHT)

        ctx.font = `24px 'Inter'`
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'

        ctx.fillText(answer.author, GIF_WIDTH / 2, 36)
        ctx.fillText(
          `${index + 1}/${answers.length}`,
          GIF_WIDTH / 2,
          GIT_HEIGHT - 24
        )

        if (answer.type === RESULT_TYPE.DRAW) {
          const image = await loadImage(answer.value)

          ctx.drawImage(
            image,
            (GIF_WIDTH - CANVAS_WIDTH) / 2,
            (GIT_HEIGHT - CANVAS_HEIGHT) / 2,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
          )
        }

        if (answer.type === RESULT_TYPE.SENTENCE) {
          ctx.font = `48px 'Inter'`

          ctx.fillText(answer.value, GIF_WIDTH / 2, GIT_HEIGHT / 2)
        }

        encoder.addFrame(ctx)

        resolve()
      })
  )

  encoder.finish()

  res.send(encoder.out.getData())
}

async function processArray(
  array: Result[],
  fn: (answer: Result, index: number) => Promise<void>
) {
  const results = []

  for (let i = 0; i < array.length; i++) {
    const result = await fn(array[i], i)

    results.push(result)
  }

  return results
}
