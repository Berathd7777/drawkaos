import { useLocalStorage } from 'hooks/useLocalStorage'
import React, { createContext, ReactNode, useContext, useEffect } from 'react'
import { SoundPreference } from 'types/SoundPreference'
import createPlayer from 'web-audio-player'

export enum SOUNDS {
  SOUND_ON = 'sound-on',
  SOUND_OFF = 'sound-off',
  ANNOUNCEMENT = 'announcement',
  EMPTY = 'empty',
}

const SOUND_VOLUME = {
  'sound-on': 0.5,
  'sound-off': 0.5,
  announcement: 1,
  empty: 0,
}

type SoundContextState = {
  isSoundEnabled: boolean
  toggleIsSoundEnabled: () => void
  play: (soundId: SOUNDS) => void
}

const emptySoundSrc = {
  src:
    'data:audio/mp3;base64,SUQzAwAAAAAAFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAAAAAAlwAAAAAtASxAAAACAAATQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAMQAAAlwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAbAAAAlwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  type: 'audio/mp3',
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

    const src =
      soundId === SOUNDS.EMPTY ? emptySoundSrc : `/sounds/${soundId}.wav`

    const audio = createPlayer(src, {
      volume: SOUND_VOLUME[soundId],
    })

    audio.on('load', () => {
      audio.play()
      audio.node.connect(audio.context.destination)
    })
  }

  const toggleIsSoundEnabled = () => {
    setHasSound({ isSoundEnabled: !isSoundEnabled })
  }

  useEffect(() => {
    const handler = () => {
      play(SOUNDS.EMPTY)
    }

    window.addEventListener('click', handler, { once: true })

    return () => {
      window.removeEventListener('click', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
