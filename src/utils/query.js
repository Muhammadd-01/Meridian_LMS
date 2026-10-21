/**
 * Reusable search / filter / sort / paginate helpers shared by the catalogue,
 * learner pages and admin tables.
 */
export function normalise(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
}

/** Case-insensitive, partial, multi-term search. Every term must match at least one field. */
export function matchesSearch(item, query, fields) {
  const terms = normalise(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return true
  const haystack = fields
    .map((field) => (typeof field === 'function' ? field(item) : item[field]))
    .flat()
    .map(normalise)
    .join(' \u0000 ')
  return terms.every((term) => haystack.includes(term))
}

export function searchItems(items, query, fields) {
  if (!query?.trim()) return items
  return items.filter((item) => matchesSearch(item, query, fields))
}

export function compareValues(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

export function sortItems(items, getter, direction = 'asc') {
  const get = typeof getter === 'function' ? getter : (item) => item[getter]
  const factor = direction === 'desc' ? -1 : 1
  return [...items].sort((x, y) => compareValues(get(x), get(y)) * factor)
}

export function paginate(items, page, pageSize) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    total,
    start: total ? start + 1 : 0,
    end: Math.min(start + pageSize, total),
  }
}

export function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export const DURATION_BUCKETS = [
  { id: 'short', label: 'Under 15 hours', test: (h) => h < 15 },
  { id: 'medium', label: '15–30 hours', test: (h) => h >= 15 && h <= 30 },
  { id: 'long', label: '30–50 hours', test: (h) => h > 30 && h <= 50 },
  { id: 'xlong', label: '50+ hours', test: (h) => h > 50 },
]

export const RATING_OPTIONS = [
  { id: '4.5', label: '4.5 & up', min: 4.5 },
  { id: '4.0', label: '4.0 & up', min: 4.0 },
  { id: '3.5', label: '3.5 & up', min: 3.5 },
]
