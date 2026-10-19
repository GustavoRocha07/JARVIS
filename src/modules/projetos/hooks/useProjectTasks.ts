
import { useCallback, useState } from "react";

import { handleListTaskService } from
    "@/modules/tasks/services/tasks.service";

export const useProjectTasks = () => {
    const [tasks, setTasks] = useState(
        () => handleListTaskService()
    );

    const refreshTasks = useCallback(() => {
        setTasks(handleListTaskService());
    }, []);

    return {
        tasks,
        refreshTasks,
    };
};
