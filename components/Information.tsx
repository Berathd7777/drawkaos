import { Heading, Stack, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: ReactNode
  description?: ReactNode
}

export function Information({ icon, title, description }: Props) {
  return (
    <Stack spacing="4" alignItems="center" justifyContent="center">
      {icon}
      <Heading fontSize="md">{title}</Heading>
      {description && <Text textAlign="center">{description}</Text>}
    </Stack>
  )
}
