import type { Status, Priority } from "@/types/todo";

export const status = {
  completed: { name: "Completed", color: "green" },
  notStarted: { name: "Not Started", color: "red" },
} satisfies Record<string, Status>;

export const priority = {
  high: { name: "High", color: "red" },
  medium: { name: "Medium", color: "yellow" },
  low: { name: "Low", color: "green" },
} satisfies Record<string, Priority>;
