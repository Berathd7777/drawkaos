import { Box, Button, Icon, SimpleGrid, Stack } from '@chakra-ui/react'
import React, { MutableRefObject, useEffect, useState } from 'react'
import { BiEraser } from 'react-icons/bi'
import { MdCheck, MdDelete, MdEdit } from 'react-icons/md'
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

const SHAPE_SIZES = [{ value: 2 }, { value: 5 }, { value: 10 }]

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement>
  canDraw: boolean
}

export function Draw({ canvasRef, canDraw }: Props) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#18181B')
  const [colorBeforeEraser, setColorBeforeEraser] = useState('')
  const [currentTool, setCurrentTool] = useState('PENCIL')
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
              disabled={!canDraw || currentTool !== 'PENCIL'}
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
            setCurrentColor(colorBeforeEraser)
            setColorBeforeEraser('')
            setCurrentTool('PENCIL')
          }}
          variant={currentTool === 'PENCIL' ? 'solid' : 'ghost'}
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
            setCurrentTool('ERASER')
          }}
          variant={currentTool === 'ERASER' ? 'solid' : 'ghost'}
          colorScheme="tertiary"
          disabled={!canDraw}
        >
          Eraser
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
