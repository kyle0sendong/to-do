export type Status = {
  name: string;
  color: string;
}

export type Priority = {
  name: string;
  color: string;
}

export type Todo = {
  id: string;
  title: string;
  status: Status;
  priority?: Priority;
  createdAt: string;
  dueDate?: string;
  notes?: string;
}