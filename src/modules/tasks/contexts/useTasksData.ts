import { useContext } from "react";

import { TasksDataContext } from "./TasksDataContext";

export const useTasksData = () => {
    const context = useContext(TasksDataContext);

    if (!context) {
        throw new Error(
            "useTasksData deve ser utilizado dentro de um TasksProvider."
        );
    }

    return context;
};