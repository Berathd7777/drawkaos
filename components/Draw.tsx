import { Box, Button, Stack } from '@chakra-ui/react'
import React, { MutableRefObject, useEffect, useState } from 'react'
import { MdCheck, MdDelete } from 'react-icons/md'

const COLORS = [
  { label: 'Black', value: '#18181B', colorScheme: 'black' },
  { label: 'Green', value: '#16A34A', colorScheme: 'green' },
  { label: 'Red', value: '#DC2626', colorScheme: 'red' },
  { label: 'Blue', value: '#2563EB', colorScheme: 'blue' },
  { label: 'Orange', value: '#F97316', colorScheme: 'orange' },
  { label: 'Yellow', value: '#FACC15', colorScheme: 'yellow' },
]

const canvasWidth = 736
const canvasHeight = 414

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement>
  canDraw: boolean
}

export function Draw({ canvasRef, canDraw }: Props) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('black')

  const prepareCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`

    const context = canvas.getContext('2d')
    context.scale(1, 1)
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    context.strokeStyle = currentColor
    context.lineWidth = 5
  }

  const startDrawing = ({ nativeEvent }) => {
    if (!canDraw) {
      return
    }

    const { offsetX, offsetY } = nativeEvent

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.beginPath()
    context.moveTo(offsetX, offsetY)

    setIsDrawing(true)
  }

  const finishDrawing = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.closePath()

    setIsDrawing(false)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !canDraw) {
      return
    }

    const { offsetX, offsetY } = nativeEvent

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.strokeStyle = currentColor
    context.lineTo(offsetX, offsetY)
    context.stroke()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current

    const context = canvas.getContext('2d')
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  useEffect(() => {
    prepareCanvas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack spacing="4">
      <Box flex="1">
        <Box
          as="canvas"
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          // @ts-ignore
          ref={canvasRef}
        />
      </Box>
      {canDraw && (
        <Stack spacing="4" direction="row" justifyContent="space-between">
          <Stack spacing="4" direction="row">
            {COLORS.map(({ label, value, colorScheme }) => (
              <Button
                key={value}
                onClick={() => {
                  setCurrentColor(value)
                }}
                backgroundColor={value}
                padding="1"
                colorScheme={colorScheme}
              >
                <Box height="4" width="4">
                  {value === currentColor ? (
                    <MdCheck
                      color={
                        ['Orange', 'Yellow'].includes(label)
                          ? 'background.500'
                          : 'white'
                      }
                    />
                  ) : null}
                </Box>
              </Button>
            ))}
          </Stack>
          <Box>
            <Button
              leftIcon={<MdDelete />}
              onClick={clearCanvas}
              variant="outline"
              colorScheme="tertiary"
            >
              Clear
            </Button>
          </Box>
        </Stack>
      )}
    </Stack>
  )
}
