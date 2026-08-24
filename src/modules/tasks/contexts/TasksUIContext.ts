import { createContext } from "react";

import type {
    Task,
    TaskModalMode,
    TasksParamsSearch,
} from "../types/tasks.type";

export type TasksUIContextValue = {
    openModal: boolean;
    openTimerModal: boolean;
    modalMode: TaskModalMode;
    openConfirmDeletedModal: boolean;
    selectedTask: Task | null;
    filters: TasksParamsSearch;

    handleOpenModal: (
        task?: Task,
        mode?: TaskModalMode,
    ) => void;
    handleSetModalMode: (
        mode: TaskModalMode,
    ) => void;
    handleConfirmDeletedTask: (task: Task) => void;
    handleOpenTimerModal: (task: Task) => void;
    handleCloseModal: () => void;
    handleCloseConfirmDeletedModal: () => void;
    handleCloseTimerModal: () => void;

    handleSetFilters: (filters: TasksParamsSearch) => void;
    handleClearFilters: () => void;
};

export const TasksUIContext =
    createContext<TasksUIContextValue | undefined>(undefined);
