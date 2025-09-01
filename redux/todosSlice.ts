import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createId } from "@paralleldrive/cuid2";
import type { RootState } from "./store";
import { status, priority } from "@/lib/constants";
import { Todo } from "@/types/todo";

interface TodosState {
  items: Todo[];
  editingCell: { rowId: string; columnId: string } | null;
  selectedIds: string[];
}

const initialState: TodosState = {
  items: [],
  editingCell: null,
  selectedIds: [],
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state) => {
      const newItem: Todo = {
        id: createId(),
        title: "New Task",
        status: status.notStarted,
        createdAt: new Date().toISOString(),
      };

      state.items.push(newItem);
    },
    updateTodo: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<Todo, "id" | "createdAt">>;
      }>
    ) => {
      const todo = state.items.find((t) => t.id === action.payload.id);
      if (todo) Object.assign(todo, action.payload.changes);
    },
    deleteTodos: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter((t) => !action.payload.includes(t.id));
    },
    toggleTodos: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      state.items.forEach((t) => {
        if (ids.includes(t.id)) {
          t.status = status.completed;
        }
      });
    },

    // Inline Editing
    startEditing: (
      state,
      action: PayloadAction<{ rowId: string; columnId: string }>
    ) => {
      state.editingCell = action.payload;
    },
    stopEditing: (state) => {
      state.editingCell = null;
    },

    replaceState: (state, action: PayloadAction<TodosState>) => {
      return action.payload;
    },
  },
});

export const todoStates = (state: RootState) => state.todos;

export const {
  addTodo,
  updateTodo,
  toggleTodos,
  deleteTodos,
  startEditing,
  stopEditing,
  replaceState,
} = todoSlice.actions;

export default todoSlice.reducer;
