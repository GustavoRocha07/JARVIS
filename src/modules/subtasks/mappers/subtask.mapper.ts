import type {
    CreateSubTask,
    SubTask,
} from "../types/subtask.type";

import type {
    SubTaskFormValues,
} from "@/modules/tasks/types/task-form.type";

export const subTaskToFormValues = (
    subTask: SubTask,
): SubTaskFormValues => ({
    title: subTask.title,
    description:
        subTask.description,
    status: subTask.status,
    priority: subTask.priority,
});

export const formValuesToCreateSubTask = (
    taskId: number,
    values: SubTaskFormValues,
): CreateSubTask => ({
    taskId,

    title: values.title.trim(),

    description:
        values.description.trim(),

    status: values.status,

    priority: values.priority,
});