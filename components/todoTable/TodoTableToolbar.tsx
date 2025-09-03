"use client";

import { Table as TableType } from "@tanstack/react-table";
import { FilterDropdown } from "./FilterDropdown";
import { SearchBar } from "./SearchBar";
import { BulkActions } from "./BulkActions";
import { status, priority } from "@/lib/constants";
import { Undo, Redo } from "lucide-react";
import { Todo } from "@/types/todo";
import { Button } from "../shadcn/button";

import { useDispatch, useSelector } from "react-redux";
import { undoDelete, redoDelete, todoStates } from "@/redux/todosSlice";

interface TodoTableToolbarProps {
  table: TableType<Todo>;
  selectedIds: string[];
  onDelete: () => void;
  onToggle: () => void;
}

export function TodoTableToolbar({
  table,
  selectedIds,
  onDelete,
  onToggle,
}: TodoTableToolbarProps) {
  const dispatch = useDispatch();
  const todos = useSelector(todoStates);

  return (
    <div className="flex justify-between mb-3 pb-2 gap-4 border-b border-b-gray-200">
      <div className="flex">
        <span
          className="font-semibold hover:bg-gray-100 py-2 px-3 rounded-md cursor-pointer text-sm"
          onClick={() => {
            table.getColumn("status")?.setFilterValue(undefined);
            table.getColumn("priority")?.setFilterValue(undefined);
          }}
        >
          All Tasks ({table.getCoreRowModel().rows.length})
        </span>

        <FilterDropdown
          table={table}
          columnId="status"
          title="By Status"
          options={status}
        />

        <FilterDropdown
          table={table}
          columnId="priority"
          title="By Priority"
          options={priority}
        />

        <FilterDropdown
          table={table}
          columnId="dueDate"
          title="By Duedate"
          options={priority}
        />

        <BulkActions
          selectedIds={selectedIds}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      </div>

      <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          onClick={() => dispatch(undoDelete())}
          disabled={todos.deleteHistory.length < 1}
        >
          <Undo size={18} />
        </Button>

        <Button
          variant="ghost"
          onClick={() => dispatch(redoDelete())}
          disabled={todos.redoHistory.length < 1}
        >
          <Redo size={18} />
        </Button>

        <SearchBar table={table} />
      </div>
    </div>
  );
}
