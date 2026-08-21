import type { Task } from "@/modules/tasks/types/tasks.type";

export type SubTask = Task & {
    id: string;
    taskId: string;
    completed: boolean;
}