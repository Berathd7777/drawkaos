import { Box, chakra, Icon, IconButton, Stack } from '@chakra-ui/react'
import React, { MutableRefObject, useEffect, useState } from 'react'
import { BiEraser } from 'react-icons/bi'
import { MdCheck, MdDelete } from 'react-icons/md'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from 'utils/constants'

const COLORS = [
  { value: '#18181B', iconColor: 'white' },
  { value: '#ffffff', iconColor: 'background.500' },
  { value: '#666666', iconColor: 'white' },
  { value: '#aaaaaa', iconColor: 'background.500' },
  { value: '#2563EB', iconColor: 'white' },
  { value: '#16A34A', iconColor: 'white' },
  { value: '#DC2626', iconColor: 'white' },
  { value: '#F97316', iconColor: 'background.500' },
  { value: '#FBBF24', iconColor: 'background.500' },
  { value: '#964112', iconColor: 'white' },
  { value: '#99004e', iconColor: 'white' },
  { value: '#ff008f', iconColor: 'background.500' },
]

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement>
  canDraw: boolean
}

export function Draw({ canvasRef, canDraw }: Props) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#18181B')

  const prepareCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`

    const context = canvas.getContext('2d')
    context.scale(1, 1)
    context.fillStyle = 'white'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
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
        <Stack spacing="4">
          <Stack
            spacing="4"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing="2" direction="row">
              {COLORS.map(({ value, iconColor }) => (
                <chakra.button
                  key={value}
                  onClick={() => {
                    setCurrentColor(value)
                  }}
                  backgroundColor={value}
                  height={10}
                  width={10}
                  borderRadius="md"
                >
                  <Icon
                    as={MdCheck}
                    color={value === currentColor ? iconColor : value}
                    height={8}
                    width={8}
                  />
                </chakra.button>
              ))}
            </Stack>
            <Stack spacing="4" direction="row">
              <IconButton
                aria-label="Eraser"
                icon={<BiEraser />}
                onClick={() => {
                  setCurrentColor('white')
                }}
                variant={currentColor === 'white' ? 'solid' : 'outline'}
                colorScheme="tertiary"
              />
              <IconButton
                aria-label="Clear"
                icon={<MdDelete />}
                onClick={clearCanvas}
                variant="outline"
                colorScheme="tertiary"
              >
                Clear
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
