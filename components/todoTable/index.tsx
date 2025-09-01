"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

// Icons
import { ListCheck, Plus, Search, Trash2, Funnel, X } from "lucide-react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { todoStates, addTodo, deleteTodos } from "@/redux/todosSlice";

// Components
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

export function TodoTable() {
  const dispatch = useDispatch();
  const todos = useSelector(todoStates);
  const [expand, setExpand] = useState(false);

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

  const handleDelete = () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);
    dispatch(deleteTodos(selectedIds));
  };

  return (
    <div className="w-full flex flex-col px-20 py-10">
      <div className="flex mb-4 gap-2 items-center">
        <ListCheck size={24} strokeWidth={3} />
        <h1 className="text-2xl font-bold">Todo List</h1>
      </div>

      <div className="flex justify-between mb-3 pb-3 gap-4 border-b border-b-gray-200">
        <div className="flex">
          <Button variant="ghost">All Tasks</Button>
          <Button variant="ghost">By Status</Button>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="!py-0 !px-2">
            <Funnel />
          </Button>

          <div className="flex items-center gap-1">
            {expand && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setExpand(false)}
                  className="!py-0 !px-2"
                >
                  <Search />
                </Button>

                <Input className="!min-w-[12rem]" autoFocus />
              </>
            )}

            <Button
              variant="ghost"
              onClick={() => setExpand(!expand)}
              className="!py-0 !px-2"
            >
              {expand ? <X /> : <Search />}
            </Button>
          </div>
        </div>
      </div>

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
