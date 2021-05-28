/* eslint-disable @typescript-eslint/no-var-requires */
const Canvas = require('canvas')
const fs = require('fs')
const path = require('path')

async function generateSocialImage() {
  try {
    const GIF_WIDTH = 1200
    const GIT_HEIGHT = 630

    Canvas.registerFont(path.resolve('./public/fonts/Inter-Regular.ttf'), {
      family: 'Inter',
    })
    Canvas.registerFont(path.resolve('./public/fonts/Inter-Bold.ttf'), {
      family: 'Inter Bold',
    })

    const canvas = Canvas.createCanvas(GIF_WIDTH, GIT_HEIGHT)
    const ctx = canvas.getContext('2d')

    const generatePicture = () =>
      new Promise(async (resolve) => {
        /* clear frame */
        ctx.clearRect(0, 0, GIF_WIDTH, GIT_HEIGHT)

        /* border */
        ctx.fillStyle = '#eebbc3'
        ctx.fillRect(0, 0, GIF_WIDTH, GIT_HEIGHT)

        /* background */
        ctx.fillStyle = '#191d31'
        ctx.fillRect(8, 8, GIF_WIDTH - 16, GIT_HEIGHT - 16)

        /* bottom text */
        ctx.font = `24px 'Inter'`
        ctx.fillStyle = '#b8c1ec'
        ctx.textAlign = 'center'
        ctx.fillText('garlicphone.vercel.app', GIF_WIDTH / 2, GIT_HEIGHT - 40)

        /* center text */
        ctx.font = `96px 'Inter Bold'`
        ctx.fillStyle = '#eebbc3'

        ctx.fillText('Garlic phone', GIF_WIDTH / 2, GIT_HEIGHT / 2)

        resolve()
      })

    await generatePicture()

    const buffer = canvas.toBuffer('image/jpeg')
    fs.writeFileSync(
      path.join(__dirname, '..', 'public', 'social.jpeg'),
      buffer
    )

    console.log('✅ Social image successfully generated')
  } catch (error) {
    console.error(error)
  }
}

generateSocialImage()
