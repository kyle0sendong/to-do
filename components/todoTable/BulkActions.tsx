"use client";

import { Trash2, CircleCheck } from "lucide-react";
import { Button } from "@/components/shadcn/button";

interface BulkActionsProps {
  selectedIds: string[];
  onDelete: () => void;
  onToggle: () => void;
}

export function BulkActions({ selectedIds, onDelete, onToggle }: BulkActionsProps) {
  if (selectedIds.length === 0) return null;

  return (
    <>
      <Button
        variant="ghost"
        className="hover:!text-red-500"
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
      <Button
        variant="ghost"
        className="hover:!text-green-500"
        onClick={onToggle}
      >
        <CircleCheck />
      </Button>
    </>
  );
}