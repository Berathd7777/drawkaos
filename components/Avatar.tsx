import BoringAvatar from 'boring-avatars'
import React, { useMemo } from 'react'
import StringSanitizer from 'string-sanitizer'

type Props = {
  seed: string
  size?: number
}

export function Avatar({ seed, size = 64 }: Props) {
  const text = useMemo(() => {
    return StringSanitizer.sanitize(seed.toLocaleLowerCase())
  }, [seed])

  return (
    <BoringAvatar
      size={size}
      name={text}
      variant="beam"
      colors={['#9D9F89', '#84AF97', '#8BC59B', '#B2DE93', '#CCEE8D']}
    />
  )
}
