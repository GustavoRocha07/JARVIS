import { createContext } from "react";

import type { Task, TasksParamsSearch } from "../types/tasks.type";
import type {  } from "../types/tasks.type";

export type TasksUIContextValue = {
    openModal: boolean;
    selectedTask: Task | null;
    filters: TasksParamsSearch;

    handleOpenModal: (task?: Task) => void;
    handleCloseModal: () => void;

    handleSetFilters: (filters: TasksParamsSearch) => void;
    handleClearFilters: () => void;
};

export const TasksUIContext =
    createContext<TasksUIContextValue | undefined>(undefined);