// src/redux/exerciseSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exercises: [],
  workoutSets: [],
  loading: false,
  error: null,
  currentWorkout: null,
};

export const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setExercises: (state, action) => {
      state.exercises = action.payload;
    },
    setWorkoutSets: (state, action) => {
      state.workoutSets = action.payload;
    },
    setCurrentWorkout: (state, action) => {
      state.currentWorkout = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    completeExercise: (state, action) => {
      const { exerciseId, workoutId } = action.payload;
      if (state.currentWorkout && state.currentWorkout.id === workoutId) {
        state.currentWorkout.completedExercises = [
          ...(state.currentWorkout.completedExercises || []),
          exerciseId
        ];
      }
    },
  },
});

export const { 
  setExercises, 
  setWorkoutSets, 
  setCurrentWorkout, 
  setLoading, 
  setError, 
  clearError,
  completeExercise 
} = exerciseSlice.actions;

export default exerciseSlice.reducer;