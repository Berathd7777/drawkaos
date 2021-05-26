import { useLocalStorage } from 'hooks/useLocalStorage'
import React, { createContext, ReactNode, useContext } from 'react'
import { SoundPreference } from 'types/SoundPreference'
import useSound from 'use-sound'

export enum SOUNDS {
  SOUND_ON = 'SOUND_ON',
  SOUND_OFF = 'SOUND_OFF',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

type SoundContextState = {
  isSoundEnabled: boolean
  toggleIsSoundEnabled: () => void
  play: (soundId: SOUNDS) => void
}

const SoundContext = createContext<SoundContextState>(undefined)

type Props = {
  children: ReactNode
}

function SoundProvider({ children }: Props) {
  const {
    value: { isSoundEnabled },
    setValue: setHasSound,
  } = useLocalStorage<SoundPreference>('sound', {
    isSoundEnabled: true,
  })
  const [playSoundOn] = useSound('/sounds/sound-off.wav', { volume: 0.25 })
  const [playSoundOff] = useSound('/sounds/sound-on.wav', { volume: 0.25 })
  const [playAnnouncement] = useSound('/sounds/announcement.wav', {
    volume: 0.85,
  })

  const play = (soundId: SOUNDS) => {
    switch (soundId) {
      case SOUNDS.SOUND_ON:
        playSoundOn()
        break
      case SOUNDS.SOUND_OFF:
        playSoundOff()
        break
      case SOUNDS.ANNOUNCEMENT:
        if (isSoundEnabled) {
          playAnnouncement()
        }
      default:
        break
    }
  }

  const toggleIsSoundEnabled = () => {
    setHasSound({ isSoundEnabled: !isSoundEnabled })
  }

  return (
    <SoundContext.Provider
      value={{ isSoundEnabled, toggleIsSoundEnabled, play }}
    >
      {children}
    </SoundContext.Provider>
  )
}

function useSounds() {
  const context = useContext(SoundContext)

  if (!context) {
    throw new Error('useSounds must be used within <SoundProvider />.')
  }

  return context
}

export { SoundProvider, useSounds }
