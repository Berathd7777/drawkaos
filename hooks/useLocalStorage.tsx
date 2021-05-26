import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue !== null) {
      setValue(JSON.parse(storedValue))
    }
  }, [key])

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return { value, setValue }
}
