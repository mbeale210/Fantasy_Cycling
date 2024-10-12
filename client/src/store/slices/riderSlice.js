import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // Ensure api is imported

// Thunk to fetch all riders
export const fetchRiders = createAsyncThunk(
  "riders/fetchRiders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/riders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to fetch open riders (riders not assigned to any team)
export const fetchOpenRiders = createAsyncThunk(
  "riders/fetchOpenRiders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/riders/open"); // Using the new API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const riderSlice = createSlice({
  name: "riders",
  initialState: {
    riders: [],
    selectedRider: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedRider: (state) => {
      state.selectedRider = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.riders = action.payload;
        state.error = null;
      })
      .addCase(fetchRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOpenRiders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOpenRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.riders = action.payload;
        state.error = null;
      })
      .addCase(fetchOpenRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedRider } = riderSlice.actions;
export default riderSlice.reducer;
