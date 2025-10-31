// src/redux/slices/responseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/apiClient';

// Create donation response
export const createResponse = createAsyncThunk(
  'responses/create',
  async (responseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/responses', responseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit response');
    }
  }
);

// Get my responses
export const getMyResponses = createAsyncThunk(
  'responses/getMyResponses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/responses/my-responses');
      return response.data.responses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch responses');
    }
  }
);

// Get responses for a request (hospital)
export const getRequestResponses = createAsyncThunk(
  'responses/getRequestResponses',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/responses/request/${requestId}`);
      return response.data.responses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch responses');
    }
  }
);

// Update response
export const updateResponse = createAsyncThunk(
  'responses/update',
  async ({ responseId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/responses/${responseId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update response');
    }
  }
);

// Delete response
export const deleteResponse = createAsyncThunk(
  'responses/delete',
  async (responseId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/responses/${responseId}`);
      return { responseId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel response');
    }
  }
);

const responseSlice = createSlice({
  name: 'responses',
  initialState: {
    myResponses: [],
    requestResponses: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create response
      .addCase(createResponse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createResponse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get my responses
      .addCase(getMyResponses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyResponses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myResponses = action.payload;
      })
      .addCase(getMyResponses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get request responses
      .addCase(getRequestResponses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRequestResponses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requestResponses = action.payload;
      })
      .addCase(getRequestResponses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update response
      .addCase(updateResponse.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      // Delete response
      .addCase(deleteResponse.fulfilled, (state, action) => {
        state.myResponses = state.myResponses.filter(
          r => r.response_id !== action.payload.responseId
        );
        state.successMessage = action.payload.message;
      });
  },
});

export const { clearError, clearSuccess } = responseSlice.actions;
export default responseSlice.reducer;
