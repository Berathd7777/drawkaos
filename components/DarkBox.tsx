import { Box } from '@chakra-ui/layout'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function DarkBox({ children }: Props) {
  return (
    <Box
      backgroundColor="background.800"
      borderRadius="md"
      boxShadow="md"
      padding="4"
    >
      {children}
    </Box>
  )
}
