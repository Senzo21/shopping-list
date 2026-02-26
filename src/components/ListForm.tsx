import { useState } from 'react'

export default function ListForm({ onCreate }:{ onCreate: (name: string)=>void }){
  const [name, setName] = useState('')
  return (
    <form className="card row" onSubmit={(e)=>{e.preventDefault(); if(!name.trim()) return; onCreate(name.trim()); setName('')}}>
      <input aria-label="List name" placeholder="New list name" value={name} onChange={e=>setName(e.target.value)} />
      <button className="btn primary" type="submit">Add List</button>
    </form>
  )
}
