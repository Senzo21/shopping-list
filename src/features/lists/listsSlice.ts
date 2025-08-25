import { createAsyncThunk, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import client from '../../api/client'
import { ShoppingList, ListItem } from '../../types'
import type { RootState } from '../../store'

export const fetchMyLists = createAsyncThunk('lists/fetchMine',
  async (ownerId: number) => {
    const res = await client.get<ShoppingList[]>(`/lists?ownerId=${ownerId}`)
    return res.data
  }
)

export const createList = createAsyncThunk('lists/create',
  async (payload: { ownerId: number; name: string }) => {
    const created = await client.post<ShoppingList>('/lists', {
      ownerId: payload.ownerId,
      name: payload.name,
      createdAt: new Date().toISOString(),
      items: []
    })
    return created.data
  }
)

export const updateList = createAsyncThunk('lists/update',
  async (payload: { id: number; changes: Partial<ShoppingList> }) => {
    const updated = await client.patch<ShoppingList>(`/lists/${payload.id}`, payload.changes)
    return updated.data
  }
)

export const deleteList = createAsyncThunk('lists/delete',
  async (id: number) => {
    await client.delete(`/lists/${id}`)
    return id
  }
)

export const addItem = createAsyncThunk('lists/addItem',
  async (payload: { list: ShoppingList; item: Omit<ListItem, 'id'> }) => {
    const item = { ...payload.item, id: nanoid() }
    const updated = await client.patch<ShoppingList>(`/lists/${payload.list.id}`, {
      items: [...payload.list.items, item]
    })
    return updated.data
  }
)

export const updateItem = createAsyncThunk('lists/updateItem',
  async (payload: { list: ShoppingList; itemId: string; changes: Partial<ListItem> }) => {
    const items = payload.list.items.map(i => i.id === payload.itemId ? { ...i, ...payload.changes } : i)
    const updated = await client.patch<ShoppingList>(`/lists/${payload.list.id}`, { items })
    return updated.data
  }
)

export const deleteItem = createAsyncThunk('lists/deleteItem',
  async (payload: { list: ShoppingList; itemId: string }) => {
    const items = payload.list.items.filter(i => i.id != payload.itemId)
    const updated = await client.patch<ShoppingList>(`/lists/${payload.list.id}`, { items })
    return updated.data
  }
)

type ListsState = {
  mine: ShoppingList[]
  status: 'idle' | 'loading' | 'failed'
  error?: string | null
}

const initialState: ListsState = { mine: [], status: 'idle', error: null }

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  builder
    .addCase(fetchMyLists.pending, (s) => {
      s.status = 'loading'
      s.error = null
    })
    .addCase(fetchMyLists.fulfilled, (s, a) => {
      s.status = 'idle'
      s.mine = a.payload
    })
    .addCase(fetchMyLists.rejected, (s, a) => {
      s.status = 'failed'
      s.error = a.error.message || 'Failed'
    })

    .addCase(createList.fulfilled, (s, a) => {
      s.mine.unshift(a.payload)
    })
    .addCase(updateList.fulfilled, (s, a) => {
      s.mine = s.mine.map(l => l.id === a.payload.id ? a.payload : l)
    })
    .addCase(deleteList.fulfilled, (s, a) => {
      s.mine = s.mine.filter(l => l.id !== a.payload)
    })
    .addCase(addItem.fulfilled, (s, a) => {
      s.mine = s.mine.map(l => l.id === a.payload.id ? a.payload : l)
    })
    .addCase(updateItem.fulfilled, (s, a) => {
      s.mine = s.mine.map(l => l.id === a.payload.id ? a.payload : l)
    })
    .addCase(deleteItem.fulfilled, (s, a) => {
      s.mine = s.mine.map(l => l.id === a.payload.id ? a.payload : l)
    })
}
})

export const selectListById = (state: RootState, id: number) => state.lists.mine.find(l=>l.id===id)
export default listsSlice.reducer
