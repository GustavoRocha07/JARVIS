import { createContext } from "react";

import type {
    CreateTask,
    Task,
    UpdateTask,
} from "../types/tasks.type";

import type {
    SubTaskFormValues,
} from "../types/task-form.type";

export type TaskSummary = {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
};

export type TasksDataContextValue = {
    tasks: Task[];

    summary: TaskSummary;

    handleCreateTask: (
        task: CreateTask,
        subTasks?: SubTaskFormValues[],
    ) => Task | null;

    handleUpdateTask: (
        task: UpdateTask,
    ) => Task | null;

    handleDeleteTask: (
        taskId: number,
    ) => boolean;
};

export const TasksDataContext =
    createContext<
        TasksDataContextValue | undefined
    >(undefined);