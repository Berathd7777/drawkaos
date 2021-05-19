import { Box, Img, Text, TypographyProps } from '@chakra-ui/react'
import React from 'react'
import { Result, RESULT_TYPE } from 'types/Player'

type Props = {
  align: TypographyProps['textAlign']
  result: Result
}

export function Reply({ result, align }: Props) {
  if (result.type === RESULT_TYPE.SENTENCE) {
    return <Text textAlign={align}>{result.value}</Text>
  }

  if (result.type === RESULT_TYPE.DRAW) {
    return (
      <Box>
        <Img src={result.value} marginLeft={align === 'left' ? 0 : 'auto'} />
      </Box>
    )
  }

  throw new Error('Unknown result type: ' + result.type)
}
