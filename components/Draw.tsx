import { Box, Button, Icon, SimpleGrid, Stack } from '@chakra-ui/react'
import Color from 'color'
import React, { MutableRefObject, useEffect, useState } from 'react'
import { BiEraser } from 'react-icons/bi'
import { MdCheck, MdDelete, MdEdit, MdFormatColorFill } from 'react-icons/md'
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
  { value: '#7C3AED', iconColor: 'white' },
  { value: '#99004e', iconColor: 'white' },
  { value: '#ff008f', iconColor: 'background.500' },
  { value: '#FBCFE8', iconColor: 'background.500' },
]

const SHAPE_SIZES = [{ value: 2 }, { value: 5 }, { value: 10 }]

enum TOOL {
  PENCIL = 'PENCIL',
  ERASER = 'ERASER',
  BUCKET = 'BUCKET',
}

type RGBA_Color = { r: number; g: number; b: number; a: number }

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement>
  canDraw: boolean
}

export function Draw({ canvasRef, canDraw }: Props) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#18181B')
  const [colorBeforeEraser, setColorBeforeEraser] = useState('')
  const [currentTool, setCurrentTool] = useState<TOOL>(TOOL.PENCIL)
  const [currentLineWidth, setCurrentLineWidth] = useState(5)

  const prepareCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`

    const context = canvas.getContext('2d')
    context.scale(1, 1)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    context.strokeStyle = currentColor
    context.lineWidth = currentLineWidth
    context.lineCap = 'round'
  }

  const startDrawing = ({ nativeEvent }) => {
    if (!canDraw) {
      return
    }

    const { offsetX, offsetY } = nativeEvent

    if (currentTool !== TOOL.BUCKET) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (currentTool === TOOL.PENCIL) {
        context.beginPath()
        context.lineWidth = currentLineWidth
        context.strokeStyle = currentColor
        context.lineTo(offsetX, offsetY)
        context.lineTo(offsetX + 1, offsetY + 1)
        context.stroke()
        context.closePath()
      }

      context.beginPath()
      context.moveTo(offsetX, offsetY)

      setIsDrawing(true)
    } else {
      floodFill(offsetX, offsetY)
    }
  }

  const getPixelPos = function (x: number, y: number, canvasWidth: number) {
    return (y * canvasWidth + x) * 4
  }

  const matchStartColor = function (
    data: unknown,
    pos: number,
    startColor: RGBA_Color
  ) {
    return (
      data[pos] === startColor.r &&
      data[pos + 1] === startColor.g &&
      data[pos + 2] === startColor.b &&
      data[pos + 3] === startColor.a
    )
  }

  const colorPixel = function (data: unknown, pos: number, color: RGBA_Color) {
    data[pos] = color.r || 0
    data[pos + 1] = color.g || 0
    data[pos + 2] = color.b || 0
    data[pos + 3] = color.hasOwnProperty('a') ? color.a : 255
  }

  const floodFill = (offsetX: number, offsetY: number) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const dstImg = context.getImageData(0, 0, canvas.width, canvas.height)
    const dstData = dstImg.data

    const startPos = getPixelPos(offsetX, offsetY, canvas.width)
    const startColor = {
      r: dstData[startPos],
      g: dstData[startPos + 1],
      b: dstData[startPos + 2],
      a: dstData[startPos + 3],
    }
    const todo = [[offsetX, offsetY]]

    while (todo.length) {
      const pos = todo.pop()
      const x = pos[0]
      let y = pos[1]
      let currentPos = getPixelPos(x, y, canvas.width)

      while (y-- >= 0 && matchStartColor(dstData, currentPos, startColor)) {
        currentPos -= canvas.width * 4
      }

      currentPos += canvas.width * 4
      ++y
      let reachLeft = false
      let reachRight = false

      while (
        y++ < canvas.height - 1 &&
        matchStartColor(dstData, currentPos, startColor)
      ) {
        const fillColor = Color.rgb(currentColor).object()

        colorPixel(dstData, currentPos, fillColor as RGBA_Color)

        if (x > 0) {
          if (matchStartColor(dstData, currentPos - 4, startColor)) {
            if (!reachLeft) {
              todo.push([x - 1, y])
              reachLeft = true
            }
          } else if (reachLeft) {
            reachLeft = false
          }
        }

        if (x < canvas.width - 1) {
          if (matchStartColor(dstData, currentPos + 4, startColor)) {
            if (!reachRight) {
              todo.push([x + 1, y])
              reachRight = true
            }
          } else if (reachRight) {
            reachRight = false
          }
        }

        currentPos += canvas.width * 4
      }
    }

    context.putImageData(dstImg, 0, 0)
  }

  const finishDrawing = () => {
    if (!isDrawing) {
      return
    }

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
    context.lineWidth = currentLineWidth
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
    <Stack
      spacing="4"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>
        <SimpleGrid columns={2} spacing="2">
          {COLORS.map(({ value, iconColor }) => (
            <Button
              key={value}
              onClick={() => {
                setCurrentColor(value)
              }}
              backgroundColor={value}
              height={10}
              width={10}
              borderRadius="md"
              disabled={!canDraw || currentTool === TOOL.ERASER}
              colorScheme="transparent"
            >
              <Icon
                as={MdCheck}
                color={value === currentColor ? iconColor : value}
                height={8}
                width={8}
              />
            </Button>
          ))}
        </SimpleGrid>
      </Box>
      <Stack spacing="4" flex="1">
        <Box
          as="canvas"
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          // @ts-ignore
          ref={canvasRef}
          borderRadius="md"
          marginX="auto"
          cursor="crosshair"
        />
        <Stack
          spacing="2"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          {SHAPE_SIZES.map(({ value }) => (
            <Button
              key={value}
              onClick={() => {
                setCurrentLineWidth(value)
              }}
              variant={currentLineWidth === value ? 'solid' : 'ghost'}
              colorScheme="tertiary"
              disabled={!canDraw}
              padding="1"
            >
              <Box
                width={`${value + 2}px`}
                height={`${value + 2}px`}
                backgroundColor={
                  currentLineWidth === value ? 'background.500' : 'tertiary.500'
                }
                borderRadius="full"
              />
            </Button>
          ))}
        </Stack>
      </Stack>

      <Stack spacing="2">
        <Button
          leftIcon={<MdEdit />}
          onClick={() => {
            if (currentTool === TOOL.ERASER) {
              setCurrentColor(colorBeforeEraser)
              setColorBeforeEraser('')
            }

            setCurrentTool(TOOL.PENCIL)
          }}
          variant={currentTool === TOOL.PENCIL ? 'solid' : 'ghost'}
          colorScheme="tertiary"
          disabled={!canDraw}
        >
          Pencil
        </Button>
        <Button
          leftIcon={<BiEraser />}
          onClick={() => {
            setColorBeforeEraser(currentColor)
            setCurrentColor('white')
            setCurrentTool(TOOL.ERASER)
          }}
          variant={currentTool === TOOL.ERASER ? 'solid' : 'ghost'}
          colorScheme="tertiary"
          disabled={!canDraw}
        >
          Eraser
        </Button>
        <Button
          leftIcon={<MdFormatColorFill />}
          onClick={() => {
            if (currentTool === TOOL.ERASER) {
              setCurrentColor(colorBeforeEraser)
              setColorBeforeEraser('')
            }

            setCurrentTool(TOOL.BUCKET)
          }}
          variant={currentTool === TOOL.BUCKET ? 'solid' : 'ghost'}
          colorScheme="tertiary"
          disabled={!canDraw}
        >
          Bucket
        </Button>
        <Button
          leftIcon={<MdDelete />}
          onClick={clearCanvas}
          variant="ghost"
          colorScheme="tertiary"
          disabled={!canDraw}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  )
}
