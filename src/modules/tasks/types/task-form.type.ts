import type {
    TaskPriority,
    TaskStatus,
} from "./tasks.type";

export type SubTaskFormValues = {
    title: string;
    description: string;

    status: TaskStatus;
    priority: TaskPriority;
};

export type TaskFormValues = {
    title: string;
    description: string;

    status: TaskStatus;
    priority: TaskPriority;

    dueDate: Date;

    subTasks: SubTaskFormValues[];
};