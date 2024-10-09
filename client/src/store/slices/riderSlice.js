import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

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

export const fetchRiderDetails = createAsyncThunk(
  "riders/fetchRiderDetails",
  async (riderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/riders/${riderId}`);
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
      .addCase(fetchRiderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRiderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRider = action.payload;
        state.error = null;
      })
      .addCase(fetchRiderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedRider } = riderSlice.actions;
export default riderSlice.reducer;
