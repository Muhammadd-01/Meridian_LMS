/**
 * Namespaced LocalStorage helpers. LocalStorage is used purely for this frontend demo —
 * it is not secure storage and is not a substitute for a backend database.
 */
export const DATA_VERSION = 5
export const NAMESPACE = 'meridian.v1'

export const STORAGE_KEYS = {
  meta: `${NAMESPACE}.meta`,
  session: `${NAMESPACE}.session`,
  ui: `${NAMESPACE}.ui`,
  collection: (name) => `${NAMESPACE}.data.${name}`,
}

function getStore(kind = 'local') {
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    return null
  }
}

export function readJSON(key, fallback = null, kind = 'local') {
  const store = getStore(kind)
  if (!store) return fallback
  try {
    const raw = store.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch (error) {
    console.warn(`[meridian] Ignoring unreadable stored value for "${key}"`, error)
    return fallback
  }
}

export function writeJSON(key, value, kind = 'local') {
  const store = getStore(kind)
  if (!store) return false
  try {
    store.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`[meridian] Could not save "${key}" (storage full or unavailable)`, error)
    return false
  }
}

export function removeKey(key, kind = 'local') {
  const store = getStore(kind)
  try {
    store?.removeItem(key)
  } catch {
    /* ignore */
  }
}

/** Removes every persisted demo data collection (the session is kept). */
export function clearDataCollections() {
  const store = getStore('local')
  if (!store) return
  const prefix = `${NAMESPACE}.data.`
  Object.keys(store)
    .filter((key) => key.startsWith(prefix) || key === STORAGE_KEYS.meta)
    .forEach((key) => store.removeItem(key))
}

/** Checks that a stored collection has the expected shape before trusting it. */
export function isValidCollection(value, seedValue) {
  if (Array.isArray(seedValue)) {
    return Array.isArray(value) && value.every((item) => item && typeof item === 'object')
  }
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
