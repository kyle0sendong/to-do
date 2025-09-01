"use client";

import { Table as TableType } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/shadcn/dropdown-menu";
import { Todo } from "@/types/todo";

interface FilterDropdownProps {
  table: TableType<Todo>;
  columnId: string;
  title: string;
  options: Record<string, { name: string }>;
}

export function FilterDropdown({
  table,
  columnId,
  title,
  options,
}: FilterDropdownProps) {
  const column = table.getColumn(columnId);
  const filterValue = column?.getFilterValue();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="font-semibold hover:bg-gray-100 py-2 px-3 rounded-md cursor-pointer text-sm">
          {title}
          <span className="font-normal">
            {filterValue
              ? `: ${String(filterValue)} (${
                  table.getFilteredRowModel().rows.length
                })`
              : ""}
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-white !p-2">
        {Object.entries(options).map(([key, { name }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => column?.setFilterValue(name)}
          >
            {name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-xs p-1"
          onClick={() => column?.setFilterValue(undefined)}
        >
          Clear Filter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
