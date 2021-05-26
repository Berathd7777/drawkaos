import {
  Box,
  Image,
  Spinner,
  Stack,
  Text,
  TypographyProps,
} from '@chakra-ui/react'
import { ColourBox } from 'components/ColourBox'
import React from 'react'
import { Result, RESULT_TYPE } from 'types/Player'
import { CANVAS_HEIGHT } from 'utils/constants'

type Props = {
  align: TypographyProps['textAlign']
  result: Result
}

export function Reply({ result, align }: Props) {
  if (result.type === RESULT_TYPE.SENTENCE) {
    return (
      <ColourBox backgroundColor="background.500">
        <Text textAlign={align}>{result.value}</Text>
      </ColourBox>
    )
  }

  const margin =
    align === 'center' ? '0 auto' : align === 'left' ? '0 0' : '0 0 0 auto'

  if (result.type === RESULT_TYPE.DRAW) {
    return (
      <Box>
        <Image
          src={result.value}
          margin={margin}
          /* The image is transparent so we add a white background */
          backgroundColor="white"
          borderRadius="md"
          fallback={
            <Stack
              height={CANVAS_HEIGHT}
              alignItems="center"
              justifyContent="center"
            >
              <Spinner size="xl" thickness="5px" />
            </Stack>
          }
        />
      </Box>
    )
  }

  throw new Error('Unknown result type: ' + result.type)
}
