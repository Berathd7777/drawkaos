import { Divider, Heading, Stack } from '@chakra-ui/layout'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  title: ReactNode
}

export function Page({ children, title }: Props) {
  return (
    <Stack spacing="8">
      <Heading as="h1" textAlign="center">
        {title}
      </Heading>
      <Divider />
      {children}
    </Stack>
  )
}
