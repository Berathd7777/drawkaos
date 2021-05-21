import { Image, Spinner, Stack } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import StringSanitizer from 'string-sanitizer'

type Props = {
  seed: string
  size?: string
}

export function Avatar({ seed, size = '64px' }: Props) {
  const text = useMemo(() => {
    return StringSanitizer.sanitize(seed.toLocaleLowerCase())
  }, [seed])

  return (
    <Image
      src={`https://avatars.dicebear.com/api/bottts/${text}.svg`}
      height={size}
      width={size}
      fallback={
        <Stack
          height={size}
          width={size}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
        </Stack>
      }
    />
  )
}
