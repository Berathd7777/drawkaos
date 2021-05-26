import { useLocalStorage } from 'hooks/useLocalStorage'
import React, { createContext, ReactNode, useContext } from 'react'
import { SoundPreference } from 'types/SoundPreference'
import createPlayer from 'web-audio-player'

export enum SOUNDS {
  SOUND_ON = 'sound-on',
  SOUND_OFF = 'sound-off',
  ANNOUNCEMENT = 'announcement',
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

  const play = (soundId: SOUNDS) => {
    if (
      soundId !== SOUNDS.SOUND_ON &&
      soundId !== SOUNDS.SOUND_OFF &&
      !isSoundEnabled
    ) {
      return
    }

    const audio = createPlayer(`/sounds/${soundId}.wav`)

    audio.on('load', () => {
      audio.play()
      audio.node.connect(audio.context.destination)
    })
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
