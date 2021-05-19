import { Box, Container, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <Stack spacing="0" minHeight="100vh">
      <Box as="header" py="2" backgroundColor="gray.900">
        <Container maxW="container.md">
          <Stack
            spacing="2"
            direction="row"
            alignItems="center"
            justifyContent="center"
            height="40px"
          >
            <NextLink href="/" passHref>
              <Link fontWeight="bold">gartic-phone</Link>
            </NextLink>
          </Stack>
        </Container>
      </Box>
      <Box as="main" flex="1" py="8">
        <Container maxW="container.md">
          <Stack spacing="8">{children}</Stack>
        </Container>
      </Box>
      <Box as="footer" py="2" backgroundColor="gray.900">
        <Container maxW="container.md">
          <Stack
            spacing="2"
            direction="row"
            alignItems="center"
            justifyContent="center"
            height="40px"
          >
            <Link
              href="https://twitter.com/DuranCristhian"
              fontWeight="bold"
              isExternal
            >
              @durancristhian
            </Link>
          </Stack>
        </Container>
      </Box>
    </Stack>
  )
}
