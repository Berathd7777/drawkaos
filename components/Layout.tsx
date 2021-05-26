import { Box, Container, Link, Stack, Text } from '@chakra-ui/react'
import { Garlic } from 'components/Icons'
import NextLink from 'next/link'
import React, { ReactNode } from 'react'
import { CONTAINER_WIDTH, LAYOUT_WIDTH } from 'utils/constants'
import { ToggleSound } from './ToggleSound'

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
        <Container maxWidth={CONTAINER_WIDTH}>
          <Stack
            spacing="4"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <NextLink href="/" passHref>
              <Link>
                <Stack
                  spacing="2"
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Garlic width="6" height="6" />
                  <Text>Garlic phone</Text>
                </Stack>
              </Link>
            </NextLink>
            <ToggleSound />
          </Stack>
        </Container>
      </Box>
      <Box as="main" flex="1" py="8">
        <Container maxWidth={CONTAINER_WIDTH}>{children}</Container>
      </Box>
      <Box as="footer" py="2" backgroundColor="background.800">
        <Container maxWidth={CONTAINER_WIDTH}>
          <Stack
            spacing="4"
            direction="row"
            alignItems="center"
            justifyContent="center"
            height="10"
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
