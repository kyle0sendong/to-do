import { TodoTable } from "@/components/todoTable";
import { Todo } from "@/types/todo";
import { status, priority } from "@/lib/constants";
import { ListCheck } from "lucide-react";
import { Button } from "@/components/shadcn/button";
export default function Home() {
  const mockData: Todo[] = [
    {
      id: "1",
      title: "Finish setup",
      status: status.completed,
      priority: priority.high,
      createdAt: new Date("8/12/2025"),
      dueDate: new Date("8/14/2025"),
      notes: "",
    },
    {
      id: "2",
      title: "Add persistence",
      status: status.notStarted,
      priority: priority.low,
      createdAt: new Date("8/12/2025"),
      dueDate: new Date("8/25/2025"),
      notes: "",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-2 px-20 py-10">
        <div className="flex gap-2 items-center">
          <ListCheck size={24} />
          <h1 className="text-2xl font-bold">Todo List</h1>
        </div>

        <div className="flex gap-4 border">
          <Button>All Tasks</Button>
          <Button>By Status</Button>
        </div>

        <TodoTable data={mockData} />
      </div>
    </div>
  );
}
