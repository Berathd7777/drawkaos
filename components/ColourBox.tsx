import { BackgroundProps, Box } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  backgroundColor?: BackgroundProps['backgroundColor']
}

export function ColourBox({
  children,
  backgroundColor = 'background.800',
}: Props) {
  return (
    <Box backgroundColor={backgroundColor} borderRadius="md" padding="4">
      {children}
    </Box>
  )
}
