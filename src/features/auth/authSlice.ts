import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import client from '../../api/client'
import { User, AuthState } from '../../types'
import { encrypt, decrypt } from '../../utils/crypto'

const fallbackState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null
}

const loadPersistedAuth = (): AuthState => {
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return fallbackState
    const parsed = JSON.parse(raw) as AuthState
    if (!parsed || (parsed.user === undefined && parsed.token === undefined)) {
      return fallbackState
    }
    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null,
      status: parsed.status ?? 'idle',
      error: parsed.error ?? null
    }
  } catch {
    return fallbackState
  }
}

const persistAuth = (state: AuthState) => {
  localStorage.setItem('auth', JSON.stringify(state))
}

const initialState: AuthState = loadPersistedAuth()

export const registerUser = createAsyncThunk('auth/register',
  async (payload: { email: string; password: string; name: string; surname: string; cell: string }) => {
    const res = await client.get<User[]>(`/users?email=${encodeURIComponent(payload.email)}`)
    if (res.data.length) throw new Error('Email already exists')
    const toCreate = { ...payload, password: encrypt(payload.password) }
    const created = await client.post<User>('/users', toCreate)
    return created.data
  }
)

export const loginUser = createAsyncThunk('auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await client.get<User[]>(`/users?email=${encodeURIComponent(payload.email)}`)
    if (!res.data.length) throw new Error('Invalid credentials')
    const user = res.data[0]
    const plain = decrypt(user.password)
    if (plain !== payload.password) throw new Error('Invalid credentials')
    const { password, ...safe } = user
    // demo token
    const token = btoa(`${user.id}:${Date.now()}`)
    return { user: safe, token }
  }
)

export const updateProfile = createAsyncThunk('auth/updateProfile',
  async (payload: { id: number; name?: string; surname?: string; cell?: string; email?: string }) => {
    const { id, ...changes } = payload
    const updated = await client.patch<User>(`/users/${id}`, changes)
    const { password, ...safe } = updated.data
    return safe
  }
)

export const updatePassword = createAsyncThunk('auth/updatePassword',
  async (payload: { id: number; newPassword: string }) => {
    const updated = await client.patch<User>(`/users/${payload.id}`, { password: encrypt(payload.newPassword) })
    const { password, ...safe } = updated.data
    return safe
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      localStorage.removeItem('auth')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(registerUser.fulfilled, (s, a) => { s.status = 'idle'; s.error = null })
      .addCase(registerUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message || 'Failed' })

      .addCase(loginUser.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(loginUser.fulfilled, (s, a: PayloadAction<{ user: Omit<User,'password'>; token: string }>) => {
        s.status = 'idle'; s.user = a.payload.user; s.token = a.payload.token; s.error = null
        persistAuth(s)
      })
      .addCase(loginUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message || 'Failed' })

      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = a.payload
        persistAuth(s)
      })
      .addCase(updatePassword.fulfilled, (s, a) => {
        s.user = a.payload
        persistAuth(s)
      })
      .addCase(updateProfile.rejected, (s, a) => {
        s.error = a.error.message || 'Failed to update profile'
      })
      .addCase(updatePassword.rejected, (s, a) => {
        s.error = a.error.message || 'Failed to update password'
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
