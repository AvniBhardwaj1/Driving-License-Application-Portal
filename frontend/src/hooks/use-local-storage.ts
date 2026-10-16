import { useCallback, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValidValue: (value: unknown) => value is T = (_value: unknown): _value is T => true,
) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = window.localStorage.getItem(key)
    if (!storedValue) return initialValue

    try {
      const parsedValue: unknown = JSON.parse(storedValue)
      return isValidValue(parsedValue) ? parsedValue : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback<Dispatch<SetStateAction<T>>>(
    (nextValue) => {
      setValue((currentValue) => {
        const resolvedValue =
          typeof nextValue === 'function'
            ? (nextValue as (previousValue: T) => T)(currentValue)
            : nextValue
        window.localStorage.setItem(key, JSON.stringify(resolvedValue))
        return resolvedValue
      })
    },
    [key],
  )

  const clearValue = useCallback(() => {
    window.localStorage.removeItem(key)
    setValue(initialValue)
  }, [initialValue, key])

  return [value, setStoredValue, clearValue] as const
}
