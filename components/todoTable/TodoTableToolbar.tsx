"use client";

import { Table as TableType } from "@tanstack/react-table";
import { FilterDropdown } from "./FilterDropdown";
import { SearchBar } from "./SearchBar";
import { BulkActions } from "./BulkActions";
import { status, priority } from "@/lib/constants";

import { Todo } from "@/types/todo";

interface TodoTableToolbarProps {
  table: TableType<Todo>;
  selectedIds: string[];
  onDelete: () => void;
  onToggle: () => void;
}

export function TodoTableToolbar({ table, selectedIds, onDelete, onToggle }: TodoTableToolbarProps) {
  return (
    <div className="flex justify-between mb-3 pb-2 gap-4 border-b border-b-gray-200">
      <div className="flex">
        <span
          className="font-semibold hover:bg-gray-100 py-2 px-3 rounded-md cursor-pointer text-sm"
          onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
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

        <BulkActions
          selectedIds={selectedIds}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      </div>

      <SearchBar table={table} />
    </div>
  );
}