import { createSlice } from "@reduxjs/toolkit";

const userActionsSlice = createSlice({
  name: "userActions",
  initialState: {
    actions: [],
  },
  reducers: {
    logUserAction: (state, action) => {
      const newAction = {
        id: Date.now(),
        actionType: action.payload.actionType,
        user: {
          id: action.payload.user.id,
          first_name: action.payload.user.first_name,
          last_name: action.payload.user.last_name,
        },
        timestamp: new Date().toISOString(),
        details: action.payload.details || {},
      };
      state.actions.unshift(newAction);
      state.actions = state.actions.slice(0, 5);
    },
    clearUserActions: (state) => {
      state.actions = [];
    },
  },
});

export const { logUserAction, clearUserActions } = userActionsSlice.actions;
export default userActionsSlice.reducer;
