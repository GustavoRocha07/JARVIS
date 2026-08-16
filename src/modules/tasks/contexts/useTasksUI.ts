import { useContext } from "react";

import { TasksUIContext } from "./TasksUIContext";

export const useTasksUI = () => {
    const context = useContext(TasksUIContext);

    if (!context) {
        throw new Error(
            "useTasksUI deve ser utilizado dentro de um TasksProvider."
        );
    }

    return context;
};