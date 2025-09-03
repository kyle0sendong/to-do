import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createId } from "@paralleldrive/cuid2";
import type { RootState } from "./store";
import { status } from "@/lib/constants";
import { Todo } from "@/types/todo";

interface TodosState {
  items: Todo[];
  editingCell: { rowId: string; columnId: string } | null;
  selectedIds: string[];
  deleteHistory: Todo[][];
  redoHistory: Todo[][];
}

const initialState: TodosState = {
  items: [],
  editingCell: null,
  selectedIds: [],
  deleteHistory: [],
  redoHistory: [],
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
      const removedTodos: Todo[] = [];
      const ids = action.payload;

      state.items = state.items.filter((todo) => {
        if (ids.includes(todo.id)) {
          removedTodos.push(todo);
          return false;
        }
        return true;
      });

      if (removedTodos.length > 0) {
        state.deleteHistory.push(removedTodos);
        state.redoHistory = []; // clear redo when new delete happens
      }
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
      return {
        ...action.payload,
        deleteHistory: action.payload.deleteHistory ?? [],
      };
    },

    // Undo/Redo
    undoDelete: (state) => {
      const lastDeleted = state.deleteHistory.pop();
      if (lastDeleted) {
        state.items.push(...lastDeleted); // Restore deleted item/s
        state.redoHistory.push(lastDeleted); // Add the item/s to redo history
      }
    },
    redoDelete: (state) => {
      const lastRedo = state.redoHistory.pop();
      if (lastRedo) {
        state.items = state.items.filter(
          // Remove todos in redoHistory that is already restored
          (todo) => !lastRedo.some((rt) => rt.id === todo.id)
        );
        state.deleteHistory.push(lastRedo); // Put back into delete history
      }
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
  undoDelete,
  redoDelete,
} = todoSlice.actions;

export default todoSlice.reducer;
