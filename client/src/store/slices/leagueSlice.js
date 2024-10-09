import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchUserLeagues = createAsyncThunk(
  "leagues/fetchUserLeagues",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/leagues");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const joinLeague = createAsyncThunk(
  "leagues/joinLeague",
  async (leagueId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/leagues/${leagueId}/join`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const leagueSlice = createSlice({
  name: "leagues",
  initialState: {
    leagues: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLeagues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues = action.payload;
        state.error = null;
      })
      .addCase(fetchUserLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(joinLeague.fulfilled, (state, action) => {
        state.leagues.push(action.payload);
        state.error = null;
      });
  },
});

export default leagueSlice.reducer;
