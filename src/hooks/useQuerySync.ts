import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { parseQuery, buildQuery, SortKey } from '../utils/urlState'

export function useQuerySync(state: { q: string; sort: SortKey; dir: 'asc' | 'desc' },
                             setState: (s: { q: string; sort: SortKey; dir: 'asc' | 'desc' }) => void) {
  const location = useLocation()
  const navigate = useNavigate()

  // When URL changes externally, update local state
  useEffect(() => {
    const next = parseQuery(location.search)
    setState(next)
  }, [location.search])

  // Keep URL in sync when local state changes via UI interactions
  useEffect(() => {
    const url = buildQuery(state.q, state.sort, state.dir)
    if (url !== location.search) {
      navigate({ search: url }, { replace: true })
    }
  }, [state.q, state.sort, state.dir])
}
