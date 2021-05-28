import { createCanvas, loadImage, registerFont } from 'canvas'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from 'utils/constants'

export type Frame = {
  upperText: string
  picture: string
  lowerText: string
}

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

    registerFont(path.resolve('./public/fonts/Inter-Regular.ttf'), {
      family: 'Inter',
    })
    registerFont(path.resolve('./public/fonts/Inter-Bold.ttf'), {
      family: 'Inter Bold',
    })

    const canvas = createCanvas(GIF_WIDTH, GIT_HEIGHT)
    const ctx = canvas.getContext('2d')

    const frame: Frame = JSON.parse(req.body)

    const generatePicture = () =>
      new Promise<void>(async (resolve) => {
        /* clear frame */
        ctx.clearRect(0, 0, GIF_WIDTH, GIT_HEIGHT)

        /* border */
        ctx.fillStyle = '#eebbc3'
        ctx.fillRect(0, 0, GIF_WIDTH, GIT_HEIGHT)

        /* background */
        ctx.fillStyle = '#191d31'
        ctx.fillRect(8, 8, GIF_WIDTH - 16, GIT_HEIGHT - 16)

        /* upper text */
        ctx.font = `24px 'Inter Bold'`
        ctx.fillStyle = '#b8c1ec'
        ctx.textAlign = 'center'
        ctx.fillText(frame.upperText, GIF_WIDTH / 2, 52)

        /* lower text */
        ctx.font = `16px 'Inter'`
        ctx.fillText(frame.lowerText, GIF_WIDTH / 2, GIT_HEIGHT - 40)

        const image = await loadImage(frame.picture)

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

        resolve()
      })

    await generatePicture()

    res.send(canvas.toBuffer())
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Error generating the picture.',
    })
  }
}
