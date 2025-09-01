import { Button } from "@/components/shadcn/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpNarrowWide, ArrowDownNarrowWide, ArrowUpDown } from "lucide-react";

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
}

export function SortableHeader<TData, TValue>({
  column,
  children,
}: SortableHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="flex items-center gap-2"
    >
      {children}
      {sorted === "asc" && <ArrowUpNarrowWide size={14} />}
      {sorted === "desc" && <ArrowDownNarrowWide size={14} />}
      {!sorted && <ArrowUpDown size={14} className="opacity-50" />}
    </Button>
  );
}
