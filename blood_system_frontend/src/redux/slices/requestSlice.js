// src/redux/slices/requestSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/apiClient';

export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/requests?${params}`);
      return response.data.requests;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
    }
  }
);

export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/requests', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create request');
    }
  }
);

export const updateRequest = createAsyncThunk(
  'requests/updateRequest',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/requests/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update request');
    }
  }
);

export const deleteRequest = createAsyncThunk(
  'requests/deleteRequest',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/requests/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete request');
    }
  }
);

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearRequestError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createRequest.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.list = state.list.filter(req => req.request_id !== action.payload);
      });
  },
});

export const { clearRequestError } = requestSlice.actions;
export default requestSlice.reducer;