import { Box, Container, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <Stack spacing="0" minHeight="100vh">
      <Box as="header" py="4" backgroundColor="gray.900">
        <Container maxW="container.xl">
          <Stack
            spacing="4"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            height="40px"
          >
            <NextLink href="/" passHref>
              <Link fontWeight="bold">gartic-phone</Link>
            </NextLink>
          </Stack>
        </Container>
      </Box>
      <Box as="main" flex="1" py="8">
        <Container maxW="container.xl">{children}</Container>
      </Box>
    </Stack>
  )
}
