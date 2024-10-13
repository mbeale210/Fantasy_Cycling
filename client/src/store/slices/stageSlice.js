import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchStages = createAsyncThunk(
  "stages/fetchStages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/stages");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchStageResults = createAsyncThunk(
  "stages/fetchStageResults",
  async (stageId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stages/${stageId}/results`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSummativeStageResults = createAsyncThunk(
  "stages/fetchSummativeStageResults",
  async (stageNumber, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/stages/${stageNumber}/summative-results`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const stageSlice = createSlice({
  name: "stages",
  initialState: {
    stages: [],
    currentStageResults: [],
    currentSummativeStageResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentStageResults: (state) => {
      state.currentStageResults = [];
    },
    clearCurrentSummativeStageResults: (state) => {
      state.currentSummativeStageResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStages.fulfilled, (state, action) => {
        state.loading = false;
        state.stages = action.payload;
        state.error = null;
      })
      .addCase(fetchStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStageResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStageResults.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStageResults = action.payload;
        state.error = null;
      })
      .addCase(fetchStageResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSummativeStageResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummativeStageResults.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSummativeStageResults = action.payload;
        state.error = null;
      })
      .addCase(fetchSummativeStageResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentStageResults, clearCurrentSummativeStageResults } =
  stageSlice.actions;
export default stageSlice.reducer;
