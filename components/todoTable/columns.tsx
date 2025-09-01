import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  CaseSensitive,
  ChartNoAxesColumn,
  ChevronsUp,
  Calendar as CalendarIcon,
  Music2,
} from "lucide-react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  startEditing,
  stopEditing,
  todoStates,
  updateTodo,
} from "@/redux/todosSlice";

// Components
import { Checkbox } from "@/components/shadcn/checkbox";
import { Calendar } from "@/components/shadcn/calendar";
import { Textarea } from "@/components/shadcn/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  status as statusItems,
  priority as priorityItems,
} from "@/lib/constants";

// Types

import { Todo } from "@/types/todo";

export function Columns(): ColumnDef<Todo>[] {
  const dispatch = useDispatch();
  const todos = useSelector(todoStates);

  return [
    {
      id: "select",
      size: 20,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      size: 200,
      header: () => (
        <span className="flex gap-1 w-fit items-center">
          <CaseSensitive size={24} strokeWidth={2.5} />
          Task
        </span>
      ),
      cell: ({ row, column }) => {
        const isEditing =
          todos.editingCell?.rowId === row.original.id &&
          todos.editingCell?.columnId === column.id;

        if (isEditing) {
          return (
            <input
              className="w-full pl-2"
              defaultValue={row.original.title}
              onBlur={(e) => {
                dispatch(
                  updateTodo({
                    id: row.original.id,
                    changes: { title: e.target.value },
                  })
                );
                dispatch(stopEditing());
              }}
              autoFocus
            ></input>
          );
        }

        return (
          <div
            className={cn(
              "w-full",
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
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      size: 100,
      maxSize: 100,
      header: () => (
        <div className="flex gap-1 items-center">
          <ChartNoAxesColumn className="rotate-270" strokeWidth={3.5} />
          Status
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>{status.name}</DropdownMenuTrigger>
            <DropdownMenuContent className="text-white !p-2">
              {Object.values(statusItems).map((status) => (
                <DropdownMenuItem
                  key={status.name}
                  onClick={() => {
                    dispatch(
                      updateTodo({
                        id: row.original.id,
                        changes: { status: status },
                      })
                    );
                  }}
                >
                  {status.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "priority",
      size: 100,
      maxSize: 100,
      header: () => (
        <div className="flex gap-1 items-center">
          <ChevronsUp size={24} strokeWidth={3} />
          Priority
        </div>
      ),
      cell: ({ row }) => {
        const priority = row.original.priority;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-full text-left">
              {priority?.name ?? "\u00A0"}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-white !p-2">
              {Object.values(priorityItems).map((priority) => (
                <DropdownMenuItem
                  key={priority.name}
                  onClick={() => {
                    dispatch(
                      updateTodo({
                        id: row.original.id,
                        changes: { priority: priority },
                      })
                    );
                  }}
                >
                  {priority.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "dueDate",
      size: 100,
      maxSize: 100,
      header: () => (
        <div className="flex gap-1 items-center">
          <CalendarIcon size={20} strokeWidth={3} />
          Due Date
        </div>
      ),
      cell: ({ row, column }) => {
        const isEditing =
          todos.editingCell?.rowId === row.original.id &&
          todos.editingCell?.columnId === column.id;

        const rowValue = row.getValue("dueDate");
        const date = rowValue
          ? new Date(row.getValue("dueDate")).toLocaleDateString()
          : "\u00A0";

        return (
          <DropdownMenu
            open={isEditing}
            onOpenChange={(open) => {
              if (open) {
                dispatch(
                  startEditing({ rowId: row.original.id, columnId: column.id })
                );
              } else {
                dispatch(stopEditing());
              }
            }}
          >
            <DropdownMenuTrigger className="w-full h-full text-left">
              {date}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 m-0 border-0 rounded-lg bg-white">
              <Calendar
                className="rounded-lg border"
                mode="single"
                selected={new Date(row.getValue("dueDate"))}
                onSelect={(item) => {
                  if (item) {
                    dispatch(
                      updateTodo({
                        id: row.original.id,
                        changes: { dueDate: item.toLocaleDateString() },
                      })
                    );
                    dispatch(stopEditing());
                  }
                }}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "createdAt",
      size: 100,
      maxSize: 100,
      header: () => (
        <div className="flex gap-1 items-center">
          <CalendarIcon size={20} strokeWidth={3} />
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
      size: 200,
      maxSize: 200,
      header: () => (
        <div className="flex gap-1 items-center">
          <Music2 size={20} strokeWidth={3.5} />
          Description
        </div>
      ),
      cell: ({ row, column }) => {
        let textareaRef: HTMLTextAreaElement | null = null;

        const isEditing =
          todos.editingCell?.rowId === row.original.id &&
          todos.editingCell?.columnId === column.id;

        return (
          <DropdownMenu
            open={isEditing}
            onOpenChange={(open) => {
              if (open) {
                dispatch(
                  startEditing({ rowId: row.original.id, columnId: column.id })
                );
              } else {
                // Save the value when closing
                if (textareaRef?.value !== undefined) {
                  dispatch(
                    updateTodo({
                      id: row.original.id,
                      changes: { notes: textareaRef.value },
                    })
                  );
                }
                dispatch(stopEditing());
              }
            }}
          >
            <DropdownMenuTrigger className="m-0 p-0 w-full truncate overflow-hidden whitespace-nowrap text-ellipsis text-left">
              {row.getValue("notes") || "\u00A0"}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-0 m-0 border-0 bg-white">
              <Textarea
                ref={(el) => {
                  textareaRef = el;
                }}
                id={`dropdown-notes-${row.original.id}`}
                autoFocus
                className="rounded-lg w-[300px]"
                defaultValue={row.getValue("notes") || ""}
                placeholder="Enter your notes here"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
