import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type {
  TaskPriority,
  TaskStatus,
} from "@/shared/types/task-domain.type";
import {
  isTaskPriority,
  isTaskStatus,
} from "@/shared/types/task-domain.type";

import type { SubTaskFormValues } from "./task-form.type";

export type { TaskPriority, TaskStatus } from "@/shared/types/task-domain.type";

export type TaskModalMode = "view" | "edit" | "create";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  subTasks?: SubTask[];
  createdAt: Date;
  dueDate: Date;
}

export type CreateTask = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
};

export type UpdateTask = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
};

export type TasksParamsSearch = {
  name?: string;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
};

export type TaskSubmit =
  | {
      action: "CREATE";
      task: CreateTask;
      subTasks: SubTaskFormValues[];
    }
  | {
      action: "UPDATE";
      task: UpdateTask;
      subTasks: SubTaskFormValues[];
    };

export type TaskModalProps = {
  open: boolean;
  title: string;
  mode: TaskModalMode;
  initialData?: Task | null;
  onClose: () => void;
  onModeChange: (mode: TaskModalMode) => void;
  onSubTaskComplete: (subTask: SubTask, completed: boolean) => void;
  onSubmit: (values: TaskSubmit) => void;
};

const isValidDate = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  return !Number.isNaN(new Date(value).getTime());
};

export type StoredTask = Omit<
  Task,
  "createdAt" | "dueDate" | "subTasks"
> & {
  createdAt: string;
  dueDate: string;
  subTasks?: unknown[];
};

export const isTaskFromStorage = (value: unknown): value is StoredTask => {
  if (typeof value !== "object" || value === null) return false;

  if (!("id" in value)) return false;
  if (!("title" in value)) return false;
  if (!("description" in value)) return false;
  if (!("status" in value)) return false;
  if (!("priority" in value)) return false;
  if (!("createdAt" in value)) return false;
  if (!("dueDate" in value)) return false;

  return (
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    isTaskStatus(value.status) &&
    isTaskPriority(value.priority) &&
    isValidDate(value.createdAt) &&
    isValidDate(value.dueDate)
  );
};
