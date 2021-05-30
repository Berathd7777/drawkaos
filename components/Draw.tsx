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
  Text,
} from '@chakra-ui/react'
import Color from 'color'
import CanvasDraw from 'components/react-canvas-draw/CanvasDraw'
import { useToasts } from 'contexts/Toasts'
import { storage } from 'firebase/init'
import { useInterval } from 'hooks/useInterval'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { BiEraser } from 'react-icons/bi'
import {
  MdCheck,
  MdDelete,
  MdEdit,
  MdFormatColorFill,
  MdRedo,
  MdUndo,
} from 'react-icons/md'
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
  BUCKET = 'BUCKET',
}

type Props = {
  timeExpired: boolean
  saveReply: (value: string) => Promise<void>
  storagePath: string
}

export function Draw({ timeExpired, saveReply, storagePath }: Props) {
  const { showToast } = useToasts()
  const [currentTool, setCurrentTool] = useState(TOOL.PENCIL)
  const [currentColor, setCurrentColor] = useState(COLORS[0].value)
  const [alpha, setAlpha] = useState(1)
  const [colorBeforeEraser, setColorBeforeEraser] = useState('')
  const [alplhaBeforeEraser, setAlplhaBeforeEraser] = useState(null)
  const [currentLineWidth, setCurrentLineWidth] = useState(SHAPE_SIZES[1].value)
  const canvasRef = useRef<CanvasDraw>(null)
  const initialFocusRef = useRef<HTMLInputElement>()
  const [canSubmit, setCanSubmit] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus()
    }
  }, [])

  useInterval(
    () => {
      setCanSubmit(
        canvasRef.current
          ? JSON.parse(canvasRef.current.getSaveData()).lines.length
          : false
      )
    },
    isSaving ? null : 500
  )

  const submitReply = async () => {
    try {
      setIsSaving(true)

      const imgURL = canvasRef.current.getDataURL()

      const file = await storage
        .child(storagePath)
        .putString(imgURL, 'data_url')

      const drawUrl = await file.ref.getDownloadURL()

      await saveReply(drawUrl)
    } catch (error) {
      console.error(error)

      showToast({
        status: 'error',
        description: 'There was an error while saving your draw. Try again.',
      })
    }
  }

  useEffect(() => {
    if (timeExpired) {
      submitReply()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeExpired])

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

  const redo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo()
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
              disabled={isSaving || currentTool === TOOL.ERASER}
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
          useBucket={currentTool === TOOL.BUCKET}
          canvasHeight={CANVAS_HEIGHT}
          canvasWidth={CANVAS_WIDTH}
          brushColor={color}
          brushRadius={currentLineWidth}
          hideGrid
          hideInterface
          lazyRadius={0}
          disabled={isSaving}
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
            <Text>Size</Text>
            {SHAPE_SIZES.map(({ value, dotSize }) => (
              <Button
                key={value}
                onClick={() => {
                  setCurrentLineWidth(value)
                }}
                variant={currentLineWidth === value ? 'solid' : 'ghost'}
                colorScheme="primary"
                disabled={isSaving}
                padding="1"
              >
                <Box
                  width={dotSize}
                  height={dotSize}
                  backgroundColor={
                    currentLineWidth === value
                      ? 'background.500'
                      : 'primary.500'
                  }
                  borderRadius="full"
                />
              </Button>
            ))}
          </Stack>
          <Stack spacing="4" direction="row" alignItems="center">
            <Text>Opacity</Text>
            <Slider
              colorScheme="primary"
              defaultValue={1}
              min={0.1}
              max={1}
              step={0.1}
              onChangeEnd={setAlpha}
              disabled={isSaving || currentTool === TOOL.ERASER}
              width="40"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Stack>
          <Button
            colorScheme="primary"
            onClick={submitReply}
            disabled={!canSubmit || timeExpired}
            isLoading={isSaving}
          >
            Done
          </Button>
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
          colorScheme="primary"
          disabled={isSaving}
          ref={initialFocusRef}
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
          colorScheme="primary"
          disabled={isSaving}
        >
          Eraser
        </Button>
        <Button
          leftIcon={<MdFormatColorFill />}
          onClick={() => {
            if (currentTool === TOOL.ERASER) {
              setCurrentColor(colorBeforeEraser)
              setAlpha(alplhaBeforeEraser)
              setColorBeforeEraser('')
              setAlplhaBeforeEraser(null)
            }

            setCurrentTool(TOOL.BUCKET)
          }}
          variant={currentTool === TOOL.BUCKET ? 'solid' : 'ghost'}
          colorScheme="primary"
          disabled={isSaving}
        >
          Bucket
        </Button>
        <Button
          leftIcon={<MdUndo />}
          onClick={undo}
          variant="ghost"
          colorScheme="primary"
          disabled={
            isSaving || (canvasRef.current && !canvasRef.current.canUndo())
          }
        >
          Undo
        </Button>
        <Button
          leftIcon={<MdRedo />}
          onClick={redo}
          variant="ghost"
          colorScheme="primary"
          disabled={
            isSaving || (canvasRef.current && !canvasRef.current.canRedo())
          }
        >
          Redo
        </Button>
        <Button
          leftIcon={<MdDelete />}
          onClick={clearCanvas}
          variant="ghost"
          colorScheme="primary"
          disabled={isSaving}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  )
}
