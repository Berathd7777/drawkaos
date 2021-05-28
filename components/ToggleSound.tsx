import { IconButton } from '@chakra-ui/button'
import { SOUNDS, useSounds } from 'contexts/Sounds'
import React from 'react'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'

export function ToggleSound() {
  const { isSoundEnabled, toggleIsSoundEnabled, play } = useSounds()

  const onSoundPreferenceChange = () => {
    if (isSoundEnabled) {
      play(SOUNDS.SOUND_OFF)
    } else {
      play(SOUNDS.SOUND_ON)
    }

    toggleIsSoundEnabled()
  }

  return (
    <IconButton
      aria-label={isSoundEnabled ? 'Turn off sound' : 'Turn on sound'}
      icon={isSoundEnabled ? <MdVolumeUp /> : <MdVolumeOff />}
      colorScheme="primary"
      variant="ghost"
      onClick={onSoundPreferenceChange}
    />
  )
}
