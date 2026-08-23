import type {
  TaskPriority,
  TaskStatus,
} from "@/shared/types/task-domain.type";

export type SubTask = {
  id: string;
  taskId: number;

  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;

  createdAt: Date;
};

/**
 * Dados necessários para criar uma SubTask.
 *
 * id e createdAt são gerados pela aplicação.
 * taskId só existe depois que a Task foi criada.
 */
export type CreateSubTask = {
  taskId: number;

  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;
};

/**
 * Dados permitidos durante uma atualização.
 */
export type UpdateSubTask = {
  id: string;

  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;
};
