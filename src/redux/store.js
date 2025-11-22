// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from './exerciseSlice';
import favouritesReducer from './favouritesSlice';
import planReducer from './planSlice';
import themeReducer from './themeSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    exercises: exerciseReducer,
    favourites: favouritesReducer,
    plans: planReducer,
    theme: themeReducer,
    user: userReducer,
  },
});