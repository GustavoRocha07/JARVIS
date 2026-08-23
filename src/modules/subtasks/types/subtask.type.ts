import type {
    TaskPriority,
    TaskStatus,
} from "@/modules/tasks/types/tasks.type";

export type SubTask = {
    id: string;
    taskId: number;

    title: string;
    description: string;

    status: TaskStatus;
    priority: TaskPriority;

    completed: boolean;
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

    completed: boolean;
};