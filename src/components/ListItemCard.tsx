import { ListItem } from '../types'

export default function ListItemCard({ item, onEdit, onDelete }:{ item: ListItem; onEdit: ()=>void; onDelete: ()=>void }){
  return (
    <div className="card grid" style={{gap:8}}>
      {item.imageUrl ? <img alt={item.name} src={item.imageUrl} className="responsive" /> : null}
      <div className="row" style={{justifyContent:'space-between'}}>
        <strong>{item.name}</strong>
        <span className="muted">{item.category || 'Uncategorised'}</span>
      </div>
      <div className="muted">Qty: {item.quantity} {item.notes ? `• ${item.notes}`: ''}</div>
      <div className="row">
        <button className="btn" onClick={onEdit}>Edit</button>
        <button className="btn" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}
