"use client";

import { Table as TableType } from "@tanstack/react-table";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/shadcn/dropdown-menu";
import { Calendar } from "../shadcn/calendar";
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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const column = table.getColumn(columnId);
  const filterValue = column?.getFilterValue();

  // Convert to MM/dd/YYYY
  let renderFilterValue: string | undefined;
  if (title === "By Duedate" && filterValue) {
    const date = new Date(filterValue as string);
    renderFilterValue = date.toLocaleDateString("en-US");
  } else {
    renderFilterValue = filterValue as string;
  }

  const renderDropdownItem = () => {
    return title === "By Duedate" ? (
      <Calendar
        className="rounded-lg border text-black"
        mode="single"
        selected={date}
        onSelect={(e) => {
          setDate(e);
          column?.setFilterValue(e?.toISOString());
        }}
      />
    ) : (
      Object.entries(options).map(([key, { name }]) => (
        <DropdownMenuItem
          key={key}
          onClick={() => column?.setFilterValue(name)}
        >
          {name}
        </DropdownMenuItem>
      ))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="font-semibold hover:bg-gray-100 py-2 px-3 rounded-md cursor-pointer text-sm">
          {title}
          <span className="font-normal">
            {filterValue
              ? `: ${renderFilterValue} (${
                  table.getFilteredRowModel().rows.length
                })`
              : ""}
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-white !p-2">
        {renderDropdownItem()}
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
