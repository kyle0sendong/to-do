"use client";

import { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  todoStates,
  addTodo,
  deleteTodos,
  toggleTodos,
} from "@/redux/todosSlice";

// Components
import { Columns } from "./columns";
import { TablePagination } from "./Pagination";
import { TodoTableHeader } from "./TodoTableHeader";
import { TodoTableToolbar } from "./TodoTableToolbar";
import { TodoTableContent } from "./TodoTableContent";
import { AddItemButton } from "./AddItemButton";

export function TodoTable() {
  const dispatch = useDispatch();
  const todos = useSelector(todoStates);

  // Table setup
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: todos.items,
    columns: Columns(),
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Helper functions
  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  // Event Handlers
  const handleDelete = () => {
    dispatch(deleteTodos(selectedIds));
    table.resetRowSelection();
  };

  const handleToggleTodos = () => {
    dispatch(toggleTodos(selectedIds));
  };

  const handleAddItem = () => {
    dispatch(addTodo());
  };

  return (
    <div className="w-full flex flex-col px-20 py-10">
      <TodoTableHeader />

      <TodoTableToolbar
        table={table}
        selectedIds={selectedIds}
        onDelete={handleDelete}
        onToggle={handleToggleTodos}
      />

      <TodoTableContent table={table} />

      <AddItemButton onAddItem={handleAddItem} />

      <TablePagination table={table} />
    </div>
  );
}