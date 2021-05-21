import { Box, Container, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <Stack spacing="0" minHeight="100vh" minWidth="768px">
      <Box as="header" py="2" backgroundColor="background.800">
        <Container maxWidth="768px">
          <Stack
            spacing="4"
            direction="row"
            alignItems="center"
            justifyContent="center"
            height="40px"
          >
            <NextLink href="/" passHref>
              <Link>gartic-phone</Link>
            </NextLink>
          </Stack>
        </Container>
      </Box>
      <Box as="main" flex="1" py="8">
        <Container maxWidth="768px">
          <Stack spacing="8">{children}</Stack>
        </Container>
      </Box>
      <Box as="footer" py="2" backgroundColor="background.800">
        <Container maxWidth="768px">
          <Stack
            spacing="4"
            direction="row"
            alignItems="center"
            justifyContent="center"
            height="40px"
          >
            <Link href="https://twitter.com/DuranCristhian" isExternal>
              @durancristhian
            </Link>
          </Stack>
        </Container>
      </Box>
    </Stack>
  )
}
