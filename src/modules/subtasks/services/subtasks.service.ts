import type {
    CreateSubTask,
    SubTask,
} from "../types/subtask.type";

const STORAGE_KEY = "jarvis:subtasks";

const getStoredSubTasks = (): SubTask[] => {
    const rawData =
        localStorage.getItem(STORAGE_KEY);

    if (!rawData) {
        return [];
    }

    try {
        const parsed: unknown =
            JSON.parse(rawData);

        if (!Array.isArray(parsed)) {
            return [];
        }

        console.log(parsed)
        return parsed.map((subTask) => ({
            ...subTask,
            createdAt: new Date(
                subTask.createdAt,
            ),
        }));
    } catch {
        return [];
    }
};

const saveSubTasks = (
    subTasks: SubTask[],
): void => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(subTasks),
    );
};

export const handleListSubTasksByTaskIdService =
    (
        taskId: number,
    ): SubTask[] => {
        const subTasks =
            getStoredSubTasks();

        return subTasks.filter(
            (subTask) =>
                subTask.taskId === taskId,
        );
    };

export const handleCreateSubTaskService = (
    data: CreateSubTask,
): SubTask => {
    const subTasks =
        getStoredSubTasks();

    const newSubTask: SubTask = {
        id: crypto.randomUUID(),

        taskId: data.taskId,

        title: data.title,
        description: data.description,

        status: data.status,
        priority: data.priority,

        completed: false,

        createdAt: new Date(),
    };

    saveSubTasks([
        ...subTasks,
        newSubTask,
    ]);

    return newSubTask;
};