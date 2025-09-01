"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/shadcn/button";

interface AddItemButtonProps {
  onAddItem: () => void;
}

export function AddItemButton({ onAddItem }: AddItemButtonProps) {
  return (
    <div className="ml-1">
      <Button variant="ghost" size="sm" onClick={onAddItem}>
        <Plus size={18} strokeWidth={2} color="gray" /> Add Item
      </Button>
    </div>
  );
}