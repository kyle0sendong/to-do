"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

// Icons
import { ListCheck, Plus } from "lucide-react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { todoStates, addTodo } from "@/redux/todosSlice";

// Components
import { Columns } from "./columns";
import { Button } from "@/components/shadcn/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";

export function TodoTable() {
  const dispatch = useDispatch();
  const todos = useSelector(todoStates);
  
  const table = useReactTable({
    data: todos.items,
    columns: Columns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const renderEmptyRows = (
    <TableRow>
      <TableCell colSpan={Columns.length} className="h-24 text-center">
        No todos found.
      </TableCell>
    </TableRow>
  );

  return (
    <div className="w-full flex flex-col px-20 py-10">
      <div className="flex mb-4 gap-2 items-center">
        <ListCheck size={24} strokeWidth={3} />
        <h1 className="text-2xl font-bold">Todo List</h1>
      </div>

      <div className="flex mb-3 pb-3 gap-4 border-b border-b-gray-200">
        <Button>All Tasks</Button>
        <Button>By Status</Button>
      </div>

      <div>
        <Table className="mb-2 border-b border-b-gray-200">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                    className="border-b"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
