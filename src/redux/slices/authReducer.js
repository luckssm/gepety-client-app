import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, auth: null },
  reducers: {
    setCredentials: (state, action) => {
      const { token, auth } = action.payload
      state.token = token
      state.auth = auth
    },
    logOut: state => {
      state.token = null
      state.auth = null
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions

export const selectCurrentToken = state => state.reducer.auth.token
export const selectCurrentAuth = state => state.reducer.auth.auth

export default authSlice.reducer
