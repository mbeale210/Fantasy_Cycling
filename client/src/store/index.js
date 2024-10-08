// src / store / index.js;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import teamReducer from "./slices/teamSlice";
import riderReducer from "./slices/riderSlice";
import stageReducer from "./slices/stageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    rider: riderReducer,
    stage: stageReducer,
  },
});
