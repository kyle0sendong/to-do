// store.ts
import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todosSlice";

function saveState(state: RootState) {
  try {
    localStorage.setItem("todosState", JSON.stringify(state.todos));
  } catch {
    // ignore write errors
  }
}

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
