"use client";

import { useState } from "react";
import { type Table as TableType } from "@tanstack/react-table";
import { Search, CircleX } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Todo } from "@/types/todo";

interface SearchBarProps {
  table: TableType<Todo>;
}

export function SearchBar({ table }: SearchBarProps) {
  const [expandSearchbar, setExpandSearchbar] = useState(false);

  const handleToggleSearch = () => {
    if (expandSearchbar) {
      table.getColumn("title")?.setFilterValue("");
      setExpandSearchbar(false);
    } else {
      setExpandSearchbar(true);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {expandSearchbar && (
        <>
          <Button
            variant="ghost"
            onClick={() => setExpandSearchbar(false)}
            className="!py-0 !px-2"
          >
            <Search />
          </Button>
          <Input
            className="!min-w-[12rem]"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            autoFocus
            placeholder="Search tasks..."
          />
        </>
      )}
      <Button
        variant="ghost"
        onClick={handleToggleSearch}
        className="!py-0 !px-2"
      >
        {expandSearchbar ? <CircleX /> : <Search />}
      </Button>
    </div>
  );
}
