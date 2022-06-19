import { configureStore } from "@reduxjs/toolkit";

import refreshReducer from './refresh';

export const store = configureStore({
  reducer: {
    refreshStore: refreshReducer
  },
})