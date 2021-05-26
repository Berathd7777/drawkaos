import {
  Box,
  Button,
  Icon,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from '@chakra-ui/react'
import Color from 'color'
import React, { MutableRefObject, ReactNode, useMemo, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'
import { useHotkeys } from 'react-hotkeys-hook'
import { BiEraser } from 'react-icons/bi'
import { MdCheck, MdDelete, MdEdit, MdUndo } from 'react-icons/md'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from 'utils/constants'

const PALLETE = [
  '#18181B',
  '#ffffff',
  '#666666',
  '#aaaaaa',
  '#2563EB',
  '#16A34A',
  '#DC2626',
  '#F97316',
  '#FBBF24',
  '#964112',
  '#7C3AED',
  '#99004e',
  '#ff008f',
  '#FBCFE8',
]

const COLORS = PALLETE.map((color) => {
  return {
    value: color,
    iconColor: Color(color).luminosity() > 0.5 ? 'background.500' : 'white',
  }
})

const SHAPE_SIZES = [
  { value: 1, dotSize: '5px' },
  { value: 3, dotSize: '8px' },
  { value: 4, dotSize: '10px' },
]

enum TOOL {
  PENCIL = 'PENCIL',
  ERASER = 'ERASER',
}

type Props = {
  canvasRef: MutableRefObject<CanvasDraw>
  canDraw: boolean
  doneButton: ReactNode
}

export function Draw({ canvasRef, canDraw, doneButton }: Props) {
  const [currentTool, setCurrentTool] = useState<TOOL>(TOOL.PENCIL)
  const [currentColor, setCurrentColor] = useState(COLORS[0].value)
  const [alpha, setAlpha] = useState(1)
  const [colorBeforeEraser, setColorBeforeEraser] = useState('')
  const [alplhaBeforeEraser, setAlplhaBeforeEraser] = useState(null)
  const [currentLineWidth, setCurrentLineWidth] = useState(SHAPE_SIZES[1].value)

  useHotkeys('ctrl+z, command+z', () => {
    undo()
  })

  const color = useMemo(() => {
    return Color(currentColor).alpha(alpha).string()
  }, [currentColor, alpha])

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear()
    }
  }

  const undo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo()
    }
  }

  return (
    <Stack spacing="4" direction="row" justifyContent="space-between">
      <Box flex="0 0 100px">
        <SimpleGrid columns={2} spacing="2">
          {COLORS.map(({ value, iconColor }) => (
            <Button
              key={value}
              onClick={() => {
                setCurrentColor(value)
              }}
              backgroundColor={value}
              height={10}
              borderRadius="md"
              disabled={!canDraw || currentTool === TOOL.ERASER}
              colorScheme="transparent"
              padding="0"
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
          as={CanvasDraw}
          ref={(canvasDraw) =>
            (canvasRef.current = (canvasDraw as unknown) as CanvasDraw)
          }
          canvasHeight={CANVAS_HEIGHT}
          canvasWidth={CANVAS_WIDTH}
          brushColor={color}
          brushRadius={currentLineWidth}
          hideGrid
          hideInterface
          lazyRadius={0}
          disabled={!canDraw}
          borderRadius="md"
          marginX="auto"
          cursor="crosshair"
        />
        <Stack
          spacing="0"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            spacing="2"
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            {SHAPE_SIZES.map(({ value, dotSize }) => (
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
                  width={dotSize}
                  height={dotSize}
                  backgroundColor={
                    currentLineWidth === value
                      ? 'background.500'
                      : 'tertiary.500'
                  }
                  borderRadius="full"
                />
              </Button>
            ))}
          </Stack>
          <Slider
            colorScheme="tertiary"
            defaultValue={1}
            min={0.1}
            max={1}
            step={0.1}
            onChangeEnd={setAlpha}
            disabled={!canDraw || currentTool === TOOL.ERASER}
            width="40"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          {doneButton}
        </Stack>
      </Stack>
      <Stack spacing="2" width="100px">
        <Button
          leftIcon={<MdEdit />}
          onClick={() => {
            if (currentTool === TOOL.ERASER) {
              setCurrentColor(colorBeforeEraser)
              setAlpha(alplhaBeforeEraser)
              setColorBeforeEraser('')
              setAlplhaBeforeEraser(null)
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
            setAlplhaBeforeEraser(alpha)
            setCurrentColor('white')
            setAlpha(1)
            setCurrentTool(TOOL.ERASER)
          }}
          variant={currentTool === TOOL.ERASER ? 'solid' : 'ghost'}
          colorScheme="tertiary"
          disabled={!canDraw}
        >
          Eraser
        </Button>
        <Button
          leftIcon={<MdUndo />}
          onClick={undo}
          variant="ghost"
          colorScheme="tertiary"
          disabled={!canDraw}
        >
          Undo
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
