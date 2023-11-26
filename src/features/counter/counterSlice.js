import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incrementReducer: (state) => {
      state.value += 1
    },
    decrementReducer: (state) => {
      state.value -= 1
    },
    incrementByAmountReducer: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { incrementReducer, decrementReducer, incrementByAmountReducer } = counterSlice.actions

export default counterSlice.reducer