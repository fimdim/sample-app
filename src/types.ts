export type Priority = 1 | 2 | 3 | 4 | 5;

export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  priority: Priority;
}
