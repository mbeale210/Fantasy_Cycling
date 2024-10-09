import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import teamReducer from "./slices/teamSlice";
import riderReducer from "./slices/riderSlice";
import stageReducer from "./slices/stageSlice";
import leagueReducer from "./slices/leagueSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamReducer,
    riders: riderReducer,
    stages: stageReducer,
    leagues: leagueReducer,
  },
});
