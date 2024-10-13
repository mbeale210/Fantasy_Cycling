import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all teams for the logged-in user
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

// Create a new team
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

// Update the roster of a team
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

// Update the name of a team
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

// Remove a rider from a team
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

// Swap the role of a rider (GC to Domestique or vice versa)
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

// Delete a team
export const deleteTeam = createAsyncThunk(
  "teams/deleteTeam",
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/teams/${teamId}`);
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
      // Fetch teams
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
      // Create team
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      // Update roster
      .addCase(updateRoster.fulfilled, (state, action) => {
        const index = state.teams.findIndex(
          (team) => team.id === action.payload.id
        );
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      // Update team name
      .addCase(updateTeamName.fulfilled, (state, action) => {
        const index = state.teams.findIndex(
          (team) => team.id === action.payload.id
        );
        if (index !== -1) {
          state.teams[index].name = action.payload.name;
        }
      })
      // Remove rider from team
      .addCase(removeRiderFromTeam.fulfilled, (state, action) => {
        const team = state.teams.find((team) => team.id === action.payload.id);
        if (team) {
          team.riders = team.riders.filter(
            (rider) => rider.id !== action.payload.riderId
          );
        }
      })
      // Swap rider role
      .addCase(swapRiderRole.fulfilled, (state, action) => {
        const team = state.teams.find((team) => team.id === action.payload.id);
        if (team) {
          team.riders = action.payload.riders;
        }
      })
      // Delete team
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter(
          (team) => team.id !== action.payload.id
        );
      });
  },
});

export default teamSlice.reducer;
