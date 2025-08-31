import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Todo } from "@/types/todo";
import { Button } from "../shadcn/button";
import { cn } from "@/lib/utils";
import { CaseSensitive, ChartNoAxesColumn } from "lucide-react";

export const columns: ColumnDef<Todo>[] = [
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
    cell: ({ row }) => (
      <span
        className={cn(
          "flex gap-2",
          row.original.status.name === "Completed"
            ? "line-through text-muted-foreground"
            : ""
        )}
      >
        {row.getValue("title")}
      </span>
    ),
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
        <ChartNoAxesColumn className="rotate-270" strokeWidth={3.5} />
        Priority
      </div>
    ),
    cell: ({ row }) => {
      const priority = row.original.priority;
      return <span>{priority.name}</span>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("dueDate");
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creation Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "notes",
    header: () => (
      <div className="flex gap-1 items-center">
        <ChartNoAxesColumn className="rotate-270" strokeWidth={3.5} />
        Notes
      </div>
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("notes")}</span>;
    },
  }
];
