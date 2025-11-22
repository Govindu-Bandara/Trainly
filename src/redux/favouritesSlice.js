import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favouriteExercises: [],
  favouriteWorkouts: [],
};

export const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addExerciseToFavourites: (state, action) => {
      state.favouriteExercises.push(action.payload);
    },
    removeExerciseFromFavourites: (state, action) => {
      state.favouriteExercises = state.favouriteExercises.filter(
        exercise => exercise.id !== action.payload
      );
    },
    addWorkoutToFavourites: (state, action) => {
      state.favouriteWorkouts.push(action.payload);
    },
    removeWorkoutFromFavourites: (state, action) => {
      state.favouriteWorkouts = state.favouriteWorkouts.filter(
        workout => workout.id !== action.payload
      );
    },
    setFavourites: (state, action) => {
      state.favouriteExercises = action.payload.exercises || [];
      state.favouriteWorkouts = action.payload.workouts || [];
    },
  },
});

export const {
  addExerciseToFavourites,
  removeExerciseFromFavourites,
  addWorkoutToFavourites,
  removeWorkoutFromFavourites,
  setFavourites,
} = favouritesSlice.actions;
export default favouritesSlice.reducer;