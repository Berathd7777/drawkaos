import { Box, Container, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import React, { ReactNode } from 'react'
import { CANVAS_WIDTH } from 'utils/constants'

const LAYOUT_WIDTH = `${CANVAS_WIDTH + 300}px`

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <Stack
      spacing="0"
      minHeight="100vh"
      minWidth={LAYOUT_WIDTH}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <Box as="header" py="2" backgroundColor="background.800">
        <Container maxWidth={LAYOUT_WIDTH}>
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
        <Container maxWidth={LAYOUT_WIDTH}>{children}</Container>
      </Box>
      <Box as="footer" py="2" backgroundColor="background.800">
        <Container maxWidth={LAYOUT_WIDTH}>
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
