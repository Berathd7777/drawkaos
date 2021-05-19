import { createCanvas, loadImage } from 'canvas'
import GIFEncoder from 'gif-encoder-2'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Result, RESULT_TYPE } from 'types/Player'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method not allowed',
    })

    return
  }

  const canvasWidth = 1024
  const canvasHeight = 768
  const imageWidth = 640
  const imageHeight = 480

  const encoder = new GIFEncoder(canvasWidth, canvasHeight)
  encoder.setDelay(3000)
  encoder.start()

  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')

  const answers: Result[] = JSON.parse(req.body)

  await processArray(
    answers,
    (answer, index) =>
      new Promise(async (resolve) => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        ctx.font = '24px Tahoma'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'

        ctx.fillText(answer.author, canvasWidth / 2, 48)
        ctx.fillText(
          `${index + 1}/${answers.length}`,
          canvasWidth / 2,
          canvasHeight - 48
        )

        if (answer.type === RESULT_TYPE.DRAW) {
          const image = await loadImage(answer.value)

          ctx.drawImage(
            image,
            (canvasWidth - imageWidth) / 2,
            (canvasHeight - imageHeight) / 2,
            imageWidth,
            imageHeight
          )
        }

        if (answer.type === RESULT_TYPE.SENTENCE) {
          ctx.font = '48px Tahoma'

          ctx.fillText(answer.value, canvasWidth / 2, canvasHeight / 2)
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
