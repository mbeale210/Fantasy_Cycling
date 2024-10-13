import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchUserTeams = createAsyncThunk(
  "teams/fetchUserTeams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/teams");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTeam = createAsyncThunk(
  "teams/createTeam",
  async (teamData, { rejectWithValue }) => {
    try {
      const response = await api.post("/teams", teamData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRoster = createAsyncThunk(
  "teams/updateRoster",
  async ({ teamId, rosterData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/teams/${teamId}/roster`, rosterData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTeamName = createAsyncThunk(
  "teams/updateTeamName",
  async ({ teamId, newName }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/teams/${teamId}/name`, {
        name: newName,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeRiderFromTeam = createAsyncThunk(
  "teams/removeRiderFromTeam",
  async ({ teamId, riderId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/teams/${teamId}/riders/${riderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// New action for swapping rider roles between GC and Domestique
export const swapRiderRole = createAsyncThunk(
  "teams/swapRiderRole",
  async ({ teamId, riderId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/teams/${teamId}/riders/${riderId}/swap`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const teamSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
        state.error = null;
      })
      .addCase(fetchUserTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(updateRoster.fulfilled, (state, action) => {
        const index = state.teams.findIndex(
          (team) => team.id === action.payload.id
        );
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(updateTeamName.fulfilled, (state, action) => {
        const index = state.teams.findIndex(
          (team) => team.id === action.payload.id
        );
        if (index !== -1) {
          state.teams[index].name = action.payload.name;
        }
      })
      .addCase(removeRiderFromTeam.fulfilled, (state, action) => {
        const team = state.teams.find((team) => team.id === action.payload.id);
        if (team) {
          team.riders = team.riders.filter(
            (rider) => rider.id !== action.payload.riderId
          );
        }
      })
      .addCase(swapRiderRole.fulfilled, (state, action) => {
        const team = state.teams.find((team) => team.id === action.payload.id);
        if (team) {
          team.riders = action.payload.riders; // Update the riders after swapping
        }
      });
  },
});

export default teamSlice.reducer;
