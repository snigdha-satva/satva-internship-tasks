import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchData = createAsyncThunk(
  'users/data',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const userSlice = createSlice({
    name: 'users',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.loading = false,
                state.data = action.payload
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload
            })
    }
})


export default userSlice.reducer;