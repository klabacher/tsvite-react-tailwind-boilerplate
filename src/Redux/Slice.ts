import { createSlice } from '@reduxjs/toolkit';

type initialStateType = {
  theme: 'dark' | 'light';
};

// Default initial state
const initialState: initialStateType = {
  theme: 'dark',
};

// Define the Redux slice (Reducers + Actions)
export const reduxSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    // Theme reducer
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
  selectors: {
    getThemeState: (state: initialStateType) => state.theme,
  },
});

// export your actions/reducers here
export const { toggleTheme } = reduxSlice.actions;

// export your selectors here
export const { getThemeState } = reduxSlice.selectors;
// Export the reducer to be used in the store
export default reduxSlice.reducer;

// Export the state type
export type ReduxState = typeof initialState;
