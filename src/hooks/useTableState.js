import { useState } from 'react'
import { paginate, searchItems, sortItems } from '../utils/query'

/**
 * Search + filters + sort + pagination state for admin tables.
 * `getters` maps a sort key to a value getter; `searchFields` feeds matchesSearch.
 * Changing the query, filters or page size always returns to page 1.
 */
export function useTableState({ initialSort = null, pageSize: initialSize = 10, initialFilters = {}, initialQuery = '' } = {}) {
  const [query, setQueryState] = useState(initialQuery)
  const [filters, setFiltersState] = useState(initialFilters)
  const [sort, setSortState] = useState(initialSort)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialSize)

  const setQuery = (q) => { setQueryState(q); setPage(1) }
  const setFilter = (key, value) => { setFiltersState((f) => ({ ...f, [key]: value })); setPage(1) }
  const resetFilters = () => { setFiltersState(initialFilters); setQueryState(''); setPage(1) }
  const setSort = (s) => { setSortState(s); setPage(1) }
  const setPageSize = (n) => { setPageSizeState(n); setPage(1) }

  const apply = (rows, { searchFields = [], getters = {}, predicate } = {}) => {
    let result = searchItems(rows, query, searchFields)
    if (predicate) result = result.filter((row) => predicate(row, filters))
    if (sort?.key) result = sortItems(result, getters[sort.key] || sort.key, sort.direction)
    return { filtered: result, ...paginate(result, page, pageSize) }
  }

  return { query, setQuery, filters, setFilter, resetFilters, sort, setSort, page, setPage, pageSize, setPageSize, apply }
}
