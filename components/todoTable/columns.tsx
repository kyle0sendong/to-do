import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import {
  CaseSensitive,
  ChartNoAxesColumn,
  ChevronsUp,
  Calendar,
  Music2,
} from "lucide-react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { startEditing, stopEditing, todoStates } from "@/redux/todosSlice";

// Components
import { Checkbox } from "@/components/shadcn/checkbox";
import { Button } from "../shadcn/button";

// Types
import { Todo } from "@/types/todo";

export function Columns(): ColumnDef<Todo>[] {
  const dispatch = useDispatch();
  const todos = useSelector(todoStates);

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          area-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: () => (
        <div className="flex gap-1 items-center">
          <CaseSensitive size={24} strokeWidth={2.5} />
          Task
        </div>
      ),
      cell: ({ row, column }) => {
        const isEditing =
          todos.editingCell?.rowId === row.original.id &&
          todos.editingCell?.columnId === column.id;

        if (isEditing) {
          return (
            <input
              className="border px-2 py-1"
              defaultValue={row.original.title}
              onBlur={(e) => {
                dispatch(stopEditing());
              }}
              autoFocus
            />
          );
        }
        return (
          <span
            className={cn(
              "flex gap-2",
              row.original.status.name === "Completed"
                ? "line-through text-muted-foreground"
                : ""
            )}
            onClick={() => {
              dispatch(
                startEditing({ rowId: row.original.id, columnId: column.id })
              );
            }}
          >
            {row.getValue("title")}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex gap-1 items-center">
          <ChartNoAxesColumn className="rotate-270" strokeWidth={3.5} />
          Status
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return <span>{status.name}</span>;
      },
    },
    {
      accessorKey: "priority",
      header: () => (
        <div className="flex gap-1 items-center">
          <ChevronsUp size={24} strokeWidth={3} />
          Priority
        </div>
      ),
      cell: ({ row }) => {
        const priority = row.original.priority;
        return <span>{priority?.name}</span>;
      },
    },
    {
      accessorKey: "dueDate",
      header: () => (
        <div className="flex gap-1 items-center">
          <Calendar size={20} strokeWidth={3} />
          Due Date
        </div>
      ),
      cell: ({ row }) => {
        const rowValue = row.getValue("dueDate");
        const date = rowValue
          ? new Date(row.getValue("dueDate")).toLocaleDateString()
          : "";
        return <span>{date}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="flex gap-1 items-center">
          <Calendar size={20} strokeWidth={3} />
          Creation Date
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt")).toLocaleDateString();
        return <span>{date}</span>;
      },
    },
    {
      accessorKey: "notes",
      header: () => (
        <div className="flex gap-1 items-center">
          <Music2 size={20} strokeWidth={3.5} />
          Notes
        </div>
      ),
      cell: ({ row }) => {
        return <span>{row.getValue("notes")}</span>;
      },
    },
  ];
}
