import { createContext } from "react";

import type {
    CreateTask,
    Task,
    UpdateTask,
} from "../types/tasks.type";

export type TaskSummary = {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
};

export type TasksDataContextValue = {
    tasks: Task[];
    summary: TaskSummary;

    handleCreateTask: (task: CreateTask) => void;
    handleUpdateTask: (task: UpdateTask) => void;
    handleDeleteTask: (taskId: number) => void;
};

export const TasksDataContext =
    createContext<TasksDataContextValue | undefined>(undefined);