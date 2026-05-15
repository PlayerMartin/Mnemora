import { useRef, useLayoutEffect } from 'react'

export function useLatest<T>(value: T): React.RefObject<T> {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
