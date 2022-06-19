import { createSlice } from "@reduxjs/toolkit";

export const refreshSlice = createSlice({
  name: 'refresh',
  initialState: {
    refresh: false
  },
  reducers: {
    refreshApp: (state) => {
      state.refresh = !state.refresh
    }
  }
})

// Export actions to invoke functions from everywhere in the App
export const { refreshApp } = refreshSlice.actions
export default refreshSlice.reducer