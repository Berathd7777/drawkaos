import { IconButton } from '@chakra-ui/button'
import React from 'react'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import useSound from 'use-sound'

type Sound = {
  enabled: boolean
}

export function Sound() {
  const [playSoundOn] = useSound('sounds/sound-off.wav', { volume: 0.5 })
  const [playSoundOff] = useSound('sounds/sound-on.wav', { volume: 0.5 })
  const {
    value: { enabled },
    setValue: setHasSound,
  } = useLocalStorage<Sound>('sound', {
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

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = React.useState(defaultValue)

  React.useEffect(() => {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue !== null) {
      setValue(JSON.parse(storedValue))
    }
  }, [key])

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return { value, setValue }
}
