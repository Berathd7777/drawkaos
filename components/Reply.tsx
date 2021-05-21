import {
  Box,
  Image,
  Spinner,
  Stack,
  Text,
  TypographyProps,
} from '@chakra-ui/react'
import React from 'react'
import { Result, RESULT_TYPE } from 'types/Player'
import { CANVAS_HEIGHT } from 'utils/constants'

type Props = {
  align: TypographyProps['textAlign']
  result: Result
}

export function Reply({ result, align }: Props) {
  if (result.type === RESULT_TYPE.SENTENCE) {
    return <Text textAlign={align}>{result.value}</Text>
  }

  const margin =
    align === 'center' ? '0 auto' : align === 'left' ? '0 0' : '0 0 0 auto'

  if (result.type === RESULT_TYPE.DRAW) {
    return (
      <Box>
        <Image
          src={result.value}
          margin={margin}
          boxShadow="md"
          fallback={
            <Stack
              height={CANVAS_HEIGHT}
              alignItems="center"
              justifyContent="center"
            >
              <Spinner size="xl" color="tertiary.500" thickness="5px" />
            </Stack>
          }
        />
      </Box>
    )
  }

  throw new Error('Unknown result type: ' + result.type)
}
