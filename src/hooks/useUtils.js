import { useEffect, useRef, useState } from 'react'

/** A stable "now" timestamp captured once per mount (keeps render pure). */
export function useNow() {
  const [now] = useState(() => Date.now())
  return now
}

export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function useClickOutside(ref, handler, active = true) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])
  useEffect(() => {
    if (!active) return undefined
    const listener = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handlerRef.current(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, active])
}

/** Warns before leaving the page (tab close / reload) while `when` is true. */
export function useBeforeUnload(when) {
  useEffect(() => {
    if (!when) return undefined
    const listener = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', listener)
    return () => window.removeEventListener('beforeunload', listener)
  }, [when])
}
