import { configureStore } from '@reduxjs/toolkit';
import Slice from '../Redux/Slice';

const store = configureStore({
  reducer: {
    main: Slice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
