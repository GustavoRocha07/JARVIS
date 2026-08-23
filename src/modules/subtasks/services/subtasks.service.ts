import type {
    CreateSubTask,
    SubTask,
} from "../types/subtask.type";

const STORAGE_KEY =
    "jarvis:subtasks";

export const handleCreateSubTaskService = (
    data: CreateSubTask,
): SubTask => {
    const stored =
        localStorage.getItem(
            STORAGE_KEY,
        );

    const subTasks: SubTask[] =
        stored
            ? JSON.parse(stored)
            : [];

    const newSubTask: SubTask = {
        id: crypto.randomUUID(),

        taskId: data.taskId,

        title: data.title,
        description:
            data.description,

        status: data.status,
        priority: data.priority,

        completed: false,

        createdAt: new Date(),
    };

    const updatedSubTasks = [
        ...subTasks,
        newSubTask,
    ];

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            updatedSubTasks,
        ),
    );

    return newSubTask;
};