import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createId } from "@paralleldrive/cuid2";
import type { RootState } from "./store";
import { status, priority } from "@/lib/constants";
import { Todo } from "@/types/todo";

interface TodosState {
  items: Todo[];
  editingCell: { rowId: string; columnId: string } | null;
  selectedIds: string[];
  filter: "all" | "completed" | "active";
  sort: { key: keyof Todo; direction: "asc" | "desc" } | null;
  pagination: {
    page: number;
    pageSize: number;
  };
}

const initialState: TodosState = {
  items: [
    {
      id: createId(),
      title: "Finish setup",
      status: status.completed,
      priority: priority.high,
      createdAt: new Date("8/31/2025").toISOString(),
      dueDate: new Date("9/1/2025").toISOString(),
      notes: "Finish the setup immediately",
    },
    {
      id: createId(),
      title: "Add persistence",
      status: status.notStarted,
      priority: priority.low,
      createdAt: new Date("8/31/2025").toISOString(),
      dueDate: new Date("9/1/2025").toISOString(),
      notes: "",
    },
  ],
  editingCell: null,
  selectedIds: [],
  filter: "all",
  sort: null,
  pagination: { page: 1, pageSize: 10 },
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

    setFilter: (state, action: PayloadAction<TodosState["filter"]>) => {
      state.filter = action.payload;
    },

    setSort: (
      state,
      action: PayloadAction<{ key: keyof Todo; direction: "asc" | "desc" }>
    ) => {
      state.sort = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
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
  setFilter,
  setSort,
  setPage,
  setPageSize,
} = todoSlice.actions;

export default todoSlice.reducer;
