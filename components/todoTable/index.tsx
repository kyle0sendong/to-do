"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";

// Icons
import {
  ListCheck,
  Plus,
  Search,
  Trash2,
  CircleX,
  CircleCheck,
} from "lucide-react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  todoStates,
  addTodo,
  deleteTodos,
  toggleTodos,
} from "@/redux/todosSlice";

// Components
import { status, priority } from "@/lib/constants";
import { Columns } from "./columns";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/shadcn/dropdown-menu";

export function TodoTable() {
  const dispatch = useDispatch();
  const todos = useSelector(todoStates);
  const [expandSearchbar, setExpandSearchbar] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: todos.items,
    columns: Columns(),
    state: {
      columnFilters,
      sorting,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  const renderEmptyRows = (
    <TableRow>
      <TableCell colSpan={Columns.length} className="text-center">
        No tasks found.
      </TableCell>
    </TableRow>
  );

  const handleDelete = () => {
    dispatch(deleteTodos(selectedIds));
  };

  const handleToggleTodos = () => {
    dispatch(toggleTodos(selectedIds));
  };

  return (
    <div className="w-full flex flex-col px-20 py-10">
      <div className="flex mb-4 gap-2 items-center">
        <ListCheck size={24} strokeWidth={3} />
        <h1 className="text-2xl font-bold">Todo List</h1>
      </div>

      {/* Top toolbar */}
      <div className="flex justify-between mb-3 pb-2 gap-4 border-b border-b-gray-200">
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="font-semibold hover:bg-gray-100 py-2 px-3 rounded-md cursor-pointer text-sm">
                By Status
                <span className="font-normal">
                  {table.getColumn("status")?.getFilterValue()
                    ? `: ${String(table.getColumn("status")?.getFilterValue())}`
                    : ""}
                </span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-white !p-2">
              {Object.entries(status).map(([key, { name }]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => {
                    table.getColumn("status")?.setFilterValue(name);
                  }}
                >
                  {name}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs p-1"
                onClick={() => {
                  table.getColumn("status")?.setFilterValue(undefined); // clear filter
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="font-semibold hover:bg-gray-100 py-2 px-3 rounded-md cursor-pointer text-sm">
                By Priority
                <span className="font-normal">
                  {table.getColumn("priority")?.getFilterValue()
                    ? `: ${String(
                        table.getColumn("priority")?.getFilterValue()
                      )}`
                    : ""}
                </span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-white !p-2">
              {Object.entries(priority).map(([key, { name }]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => {
                    table.getColumn("priority")?.setFilterValue(name);
                  }}
                >
                  {name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs p-1"
                onClick={() => {
                  table.getColumn("priority")?.setFilterValue(undefined); // clear filter
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedIds.length > 0 && (
            <>
              <Button
                variant="ghost"
                className="hover:!text-red-500"
                onClick={handleDelete}
              >
                <Trash2 />
              </Button>

              <Button
                variant="ghost"
                className="hover:!text-green-500"
                onClick={handleToggleTodos}
              >
                <CircleCheck />
              </Button>
            </>
          )}
        </div>

        {/* Search bar */}
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
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
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
            onClick={() => {
              if (expandSearchbar) {
                table.getColumn("title")?.setFilterValue("");
                setExpandSearchbar(false);
              } else {
                setExpandSearchbar(true);
              }
            }}
            className="!py-0 !px-2"
          >
            {expandSearchbar ? <CircleX /> : <Search />}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div>
        <Table className="mb-2 border-b border-b-gray-200">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-1.5 border-b border-r"
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : renderEmptyRows}
          </TableBody>
        </Table>
      </div>

      <div className="ml-1">
        <Button variant="ghost" size="sm" onClick={() => dispatch(addTodo())}>
          <Plus size={18} strokeWidth={2} color="gray" /> Add Item
        </Button>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
