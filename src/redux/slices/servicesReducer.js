import { createSlice } from '@reduxjs/toolkit'

const servicesSlice = createSlice({
  name: 'services',
  initialState: {},
  reducers: {
    setServiceCheckoutInformation: (state, action) => {
      state.serviceCheckoutInformation = action.payload
    },
    clearServiceCheckoutInformation: state => {
      state.serviceCheckoutInformation = null
    },
    setServiceScheduledInformation: (state, action) => {
      state.serviceScheduledInformation = action.payload
    },
    clearServiceScheduledInformation: state => {
      state.serviceScheduledInformation = null
    }
  }
})

export const {
  setServiceCheckoutInformation,
  clearServiceCheckoutInformation,
  setServiceScheduledInformation,
  clearServiceScheduledInformation
} = servicesSlice.actions

export const selectServiceCheckoutInformation = state =>
  state.reducer.services.serviceCheckoutInformation

export const selectServiceScheduledInformation = state =>
  state.reducer.services.serviceScheduledInformation

export default servicesSlice.reducer
