import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import { firestoreApi } from "./fireStoreApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    [firestoreApi.reducerPath]: firestoreApi.reducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(firestoreApi.middleware), 
});
setupListeners(store.dispatch)
export default store;
