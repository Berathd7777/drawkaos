import { createCanvas, loadImage, registerFont } from 'canvas'
import GIFEncoder from 'gif-encoder-2'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { Result, RESULT_TYPE } from 'types/Player'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from 'utils/constants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed.',
    })

    return
  }

  try {
    const GIF_WIDTH = CANVAS_WIDTH * 1.25
    const GIT_HEIGHT = CANVAS_HEIGHT * 1.4

    const encoder = new GIFEncoder(GIF_WIDTH, GIT_HEIGHT)
    encoder.setDelay(3000)
    encoder.start()

    registerFont(path.resolve('./public/fonts/Inter-Regular.ttf'), {
      family: 'Inter',
    })
    registerFont(path.resolve('./public/fonts/Inter-Bold.ttf'), {
      family: 'Inter Bold',
    })

    const canvas = createCanvas(GIF_WIDTH, GIT_HEIGHT)
    const ctx = canvas.getContext('2d')

    const answers: Result[] = JSON.parse(req.body)

    await processArray(
      answers,
      (answer, index) =>
        new Promise(async (resolve) => {
          /* clear frame */
          ctx.clearRect(0, 0, GIF_WIDTH, GIT_HEIGHT)

          /* border */
          ctx.fillStyle = '#eebbc3'
          ctx.fillRect(0, 0, GIF_WIDTH, GIT_HEIGHT)

          /* background */
          ctx.fillStyle = '#191d31'
          ctx.fillRect(8, 8, GIF_WIDTH - 16, GIT_HEIGHT - 16)

          /* player name */
          ctx.font = `24px 'Inter Bold'`
          ctx.fillStyle = '#b8c1ec'
          ctx.textAlign = 'center'
          ctx.fillText(answer.author, GIF_WIDTH / 2, 52)

          /* step */
          ctx.font = `16px 'Inter'`
          ctx.fillText(
            `${index + 1}/${answers.length}`,
            GIF_WIDTH / 2,
            GIT_HEIGHT - 40
          )

          if (answer.type === RESULT_TYPE.DRAW) {
            const image = await loadImage(answer.value)

            /* The image is transparent so we add a white square */
            ctx.fillStyle = 'white'
            ctx.fillRect(
              (GIF_WIDTH - CANVAS_WIDTH) / 2,
              (GIT_HEIGHT - CANVAS_HEIGHT) / 2,
              CANVAS_WIDTH,
              CANVAS_HEIGHT
            )

            ctx.drawImage(
              image,
              (GIF_WIDTH - CANVAS_WIDTH) / 2,
              (GIT_HEIGHT - CANVAS_HEIGHT) / 2,
              CANVAS_WIDTH,
              CANVAS_HEIGHT
            )
          }

          if (answer.type === RESULT_TYPE.SENTENCE) {
            ctx.font = `48px 'Inter Bold'`
            ctx.fillStyle = '#eebbc3'

            ctx.fillText(answer.value, GIF_WIDTH / 2, GIT_HEIGHT / 2)
          }

          encoder.addFrame(ctx)

          resolve()
        })
    )

    encoder.finish()

    res.send(encoder.out.getData())
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Error generating the album.',
    })
  }
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
