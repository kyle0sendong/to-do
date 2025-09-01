"use client";

import { ListCheck } from "lucide-react";

export function TodoTableHeader() {
  return (
    <div className="flex mb-4 gap-2 items-center">
      <ListCheck size={24} strokeWidth={3} />
      <h1 className="text-2xl font-bold">Todo List</h1>
    </div>
  );
}