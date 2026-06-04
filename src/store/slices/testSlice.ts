import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { testService } from '../../api/services';
import type { Test } from '../../types';

export const fetchTests = createAsyncThunk(
  'test/fetchTests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await testService.getAllTests();
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch tests');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tests');
    }
  }
);

interface TestState {
  tests: Test[];
  loading: boolean;
  error: string | null;
}

const initialState: TestState = {
  tests: [],
  loading: false,
  error: null,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default testSlice.reducer;
