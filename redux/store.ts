// store.ts
import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todosSlice";

function saveState(state: RootState) {
  try {
    const { deleteHistory, redoHistory, ...rest } = state.todos; // Save the deleteHistory in state.todos stored in local storage

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
