import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, createList, deleteItem, deleteList, fetchMyLists, updateItem, updateList } from '../features/lists/listsSlice'
import type { RootState } from '../store'
import ListForm from '../components/ListForm'
import ListItemCard from '../components/ListItemCard'
import SearchSortBar from '../components/SearchSortBar'
import { SortKey } from '../utils/urlState'
import { useQuerySync } from '../hooks/useQuerySync'

export default function Home(){
  const dispatch = useDispatch<any>()
  const { user } = useSelector((s: RootState) => s.auth)
  const lists = useSelector((s: RootState) => s.lists.mine)
  const [qs, setQs] = useState<{ q: string; sort: SortKey; dir: 'asc' | 'desc' }>({
    q: '',
    sort: 'date',
    dir: 'desc'
  })

  useQuerySync(qs, setQs)

  useEffect(() => {
    if (user) dispatch(fetchMyLists(user.id))
  }, [dispatch, user])

  const filtered = useMemo(() => {
    const rows = lists.flatMap(list => list.items.map(item => ({ list, item })))
    let next = rows

    if (qs.q) {
      const search = qs.q.toLowerCase()
      next = next.filter(r => r.item.name.toLowerCase().includes(search))
    }

    next = next.sort((a, b) => {
      const dir = qs.dir === 'asc' ? 1 : -1
      switch (qs.sort) {
        case 'name':
          return a.item.name.localeCompare(b.item.name) * dir
        case 'category':
          return (a.item.category || '').localeCompare(b.item.category || '') * dir
        default:
          return (new Date(a.list.createdAt).getTime() - new Date(b.list.createdAt).getTime()) * dir
      }
    })

    return next
  }, [lists, qs])

  return (
    <div className="container grid">
      <h1>My Shopping Lists</h1>

      <SearchSortBar
        q={qs.q}
        setQ={(q) => setQs(s => ({ ...s, q }))}
        sort={qs.sort}
        setSort={(sort) => setQs(s => ({ ...s, sort }))}
        dir={qs.dir}
        setDir={(dir) => setQs(s => ({ ...s, dir }))}
      />

      <ListForm onCreate={(name) => dispatch(createList({ ownerId: user!.id, name }))} />

      <div className="grid cols-3">
        {lists.map(list => (
          <section key={list.id} className="card grid" aria-label={`List ${list.name}`}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{list.name}</h3>
              <div className="row">
                <button
                  className="btn"
                  onClick={() => {
                    const newName = prompt('Rename list', list.name)
                    if (newName) dispatch(updateList({ id: list.id, changes: { name: newName } }))
                  }}
                >
                  Rename
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    if (confirm('Delete list?')) dispatch(deleteList(list.id))
                  }}
                >
                  Delete
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    const url = `${location.origin}/share/${list.id}`
                    navigator.clipboard.writeText(url)
                    alert('Share link copied to clipboard')
                  }}
                >
                  Share
                </button>
              </div>
            </div>

            <form
              className="row"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const fd = new FormData(form)
                const name = String(fd.get('name') || '').trim()
                if (!name) return

                const rawQuantity = Number(fd.get('quantity') || 1)
                const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1

                const item = {
                  name,
                  quantity,
                  notes: String(fd.get('notes') || ''),
                  category: String(fd.get('category') || ''),
                  imageUrl: String(fd.get('imageUrl') || '')
                }
                dispatch(addItem({ list, item }))
                form.reset()
              }}
            >
              <input name="name" placeholder="Item name" aria-label="Item name" />
              <input name="quantity" type="number" min="1" defaultValue="1" aria-label="Quantity" />
              <input name="notes" placeholder="Notes (optional)" aria-label="Notes" />
              <input name="category" placeholder="Category" aria-label="Category" />
              <input name="imageUrl" placeholder="Image URL (optional)" aria-label="Image URL" />
              <button className="btn">Add</button>
            </form>

            <div className="grid">
              {list.items.map(it => (
                <ListItemCard
                  key={it.id}
                  item={it}
                  onEdit={() => {
                    const name = prompt('Name', it.name) || it.name
                    const rawQty = Number(prompt('Quantity', String(it.quantity)) || it.quantity)
                    const quantity = Number.isFinite(rawQty) && rawQty > 0 ? rawQty : it.quantity
                    const notes = prompt('Notes', it.notes || '') || it.notes
                    const category = prompt('Category', it.category || '') || it.category
                    const imageUrl = prompt('Image URL', it.imageUrl || '') || it.imageUrl
                    dispatch(updateItem({ list, itemId: it.id, changes: { name, quantity, notes, category, imageUrl } }))
                  }}
                  onDelete={() => dispatch(deleteItem({ list, itemId: it.id }))}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="card grid">
        <h2>All Items (filter/search/sort apply)</h2>
        <div className="grid cols-3">
          {filtered.map(({ list, item }) => (
            <div key={`${list.id}-${item.id}`} className="card">
              <div className="muted" style={{ fontSize: 12 }}>From: {list.name}</div>
              <strong>{item.name}</strong>
              <div className="muted">Qty: {item.quantity} - {item.category || 'N/A'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
