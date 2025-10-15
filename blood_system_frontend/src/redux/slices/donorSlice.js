// src/redux/slices/donorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/apiClient';

export const fetchDonors = createAsyncThunk(
  'donors/fetchDonors',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/donors?${params}`);
      return response.data.donors;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch donors');
    }
  }
);

export const updateDonor = createAsyncThunk(
  'donors/updateDonor',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/donors/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update donor');
    }
  }
);

const donorSlice = createSlice({
  name: 'donors',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDonorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchDonors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateDonor.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearDonorError } = donorSlice.actions;
export default donorSlice.reducer;
