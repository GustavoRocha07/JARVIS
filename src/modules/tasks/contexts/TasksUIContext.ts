import { createContext } from "react";

import type {
    Task,
    TaskModalMode,
    TasksParamsSearch,
} from "../types/tasks.type";
import type { SubTask } from "@/modules/subtasks/types/subtask.type";

export type TasksUIContextValue = {
    openModal: boolean;
    openTimerModal: boolean;
    modalMode: TaskModalMode;
    openConfirmDeletedModal: boolean;
    selectedTask: Task | null;
    timerTarget: Task | SubTask | null;
    timerParentTitle: string | null;
    filters: TasksParamsSearch;

    handleOpenModal: (
        task?: Task,
        mode?: TaskModalMode,
    ) => void;
    handleSetModalMode: (
        mode: TaskModalMode,
    ) => void;
    handleConfirmDeletedTask: (task: Task) => void;
    handleOpenTimerModal: (
        target: Task | SubTask,
        parentTitle?: string,
    ) => void;
    handleCloseModal: () => void;
    handleCloseConfirmDeletedModal: () => void;
    handleCloseTimerModal: () => void;

    handleSetFilters: (filters: TasksParamsSearch) => void;
    handleClearFilters: () => void;
};

export const TasksUIContext =
    createContext<TasksUIContextValue | undefined>(undefined);
