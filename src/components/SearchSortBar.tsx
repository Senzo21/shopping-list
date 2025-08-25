import { SortKey } from '../utils/urlState'

export default function SearchSortBar(props: {
  q: string; setQ: (v:string)=>void;
  sort: SortKey; setSort: (v:SortKey)=>void;
  dir: 'asc'|'desc'; setDir: (v:'asc'|'desc')=>void;
}){
  return (
    <div className="card row" role="region" aria-label="Search and Sorting">
      <input aria-label="Search items by name" placeholder="Search items by name" value={props.q} onChange={e=>props.setQ(e.target.value)} />
      <select aria-label="Sort key" value={props.sort} onChange={e=>props.setSort(e.target.value as SortKey)}>
        <option value="date">Date added</option>
        <option value="name">Name</option>
        <option value="category">Category</option>
      </select>
      <select aria-label="Sort direction" value={props.dir} onChange={e=>props.setDir(e.target.value as any)}>
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  )
}
