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
      colors={['#FFAB07', '#E9D558', '#72AD75', '#0E8D94', '#434D53']}
    />
  )
}
