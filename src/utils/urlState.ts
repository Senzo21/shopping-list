export type SortKey = 'name' | 'category' | 'date'
export function parseQuery(search: string) {
  const sp = new URLSearchParams(search)
  const q = sp.get('q') ?? ''
  const sort = (sp.get('sort') as SortKey) || 'date'
  const dir = (sp.get('dir') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'
  return { q, sort, dir }
}
export function buildQuery(q: string, sort: SortKey, dir: 'asc' | 'desc') {
  const sp = new URLSearchParams()
  if (q) sp.set('q', q)
  if (sort) sp.set('sort', sort)
  if (dir) sp.set('dir', dir)
  return `?${sp.toString()}`
}
