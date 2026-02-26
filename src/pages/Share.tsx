import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import { ShoppingList } from '../types'

export default function Share(){
  const { listId } = useParams()
  const [list, setList] = useState<ShoppingList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    if (!listId) {
      setLoading(false)
      setError('Missing list id')
      return
    }

    setLoading(true)
    setError(null)
    client.get<ShoppingList>(`/lists/${listId}`)
      .then(r => setList(r.data))
      .catch(() => {
        setList(null)
        setError('List not found or unavailable')
      })
      .finally(() => setLoading(false))
  }, [listId])

  if (loading) return <div className="container"><p>Loading...</p></div>

  if (error || !list) {
    return (
      <div className="container grid">
        <h1>Shared List</h1>
        <p className="muted">{error || 'Unable to load list'}</p>
        <Link to="/login" className="btn">Login to manage your lists</Link>
      </div>
    )
  }

  return (
    <div className="container grid">
      <h1>Shared List: {list.name}</h1>
      <p className="muted">Read-only preview</p>
      <div className="grid cols-3">
        {list.items.map(it => (
          <div key={it.id} className="card grid">
            {it.imageUrl ? <img alt={it.name} src={it.imageUrl} className="responsive" /> : null}
            <strong>{it.name}</strong>
            <div className="muted">Qty: {it.quantity}</div>
            <div className="muted">{it.category || ''}</div>
            {it.notes && <div className="muted">{it.notes}</div>}
          </div>
        ))}
      </div>
      <Link to="/login" className="btn">Login to manage</Link>
    </div>
  )
}
