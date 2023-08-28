import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setUserInformations: (state, action) => {
      state.user = action.payload
    },
    clearUser: state => {
      state.user = null
    },
    setLastUserReqTime: (state, action) => {
      state.user.lastUserReqTime = action.payload
    }
  }
})

export const {
  setUserInformations,
  clearUser,
  setLastUserReqTime
} = userSlice.actions

export const selectUserInformations = state => state.reducer.user

export const getLastReqTime = state => state.reducer.user?.user?.lastUserReqTime

export default userSlice.reducer
