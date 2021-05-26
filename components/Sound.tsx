import { IconButton } from '@chakra-ui/button'
import { useLocalStorage } from 'hooks/useLocalStorage'
import React from 'react'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import { SoundPreference } from 'types/SoundPreference'
import useSound from 'use-sound'

export function Sound() {
  const [playSoundOn] = useSound('/sounds/sound-off.wav', { volume: 0.25 })
  const [playSoundOff] = useSound('/sounds/sound-on.wav', { volume: 0.25 })
  const {
    value: { enabled },
    setValue: setHasSound,
  } = useLocalStorage<SoundPreference>('sound', {
    enabled: true,
  })

  const onSoundPreferenceChange = () => {
    if (enabled) {
      playSoundOn()
    } else {
      playSoundOff()
    }

    setHasSound({
      enabled: !enabled,
    })
  }

  return (
    <IconButton
      aria-label={enabled ? 'Turn off sound' : 'Turn on sound'}
      icon={enabled ? <MdVolumeUp /> : <MdVolumeOff />}
      colorScheme="tertiary"
      variant="ghost"
      onClick={onSoundPreferenceChange}
    />
  )
}
