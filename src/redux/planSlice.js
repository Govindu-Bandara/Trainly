import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customPlans: [],
  predefinedPlans: [],
};

export const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    addCustomPlan: (state, action) => {
      state.customPlans.push(action.payload);
    },
    updateCustomPlan: (state, action) => {
      const index = state.customPlans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.customPlans[index] = action.payload;
      }
    },
    deleteCustomPlan: (state, action) => {
      state.customPlans = state.customPlans.filter(plan => plan.id !== action.payload);
    },
    setCustomPlans: (state, action) => {
      state.customPlans = action.payload;
    },
    setPredefinedPlans: (state, action) => {
      state.predefinedPlans = action.payload;
    },
  },
});

export const {
  addCustomPlan,
  updateCustomPlan,
  deleteCustomPlan,
  setCustomPlans,
  setPredefinedPlans,
} = planSlice.actions;
export default planSlice.reducer;