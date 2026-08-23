import type {
    CreateTask,
    Task,
    UpdateTask,
} from "../types/tasks.type";

import type {
    TaskFormValues,
} from "../types/task-form.type";

import {
    subTaskToFormValues,
} from "@/modules/subtasks/mappers/subtask.mapper";

export const taskToFormValues = (
    task?: Task | null,
): TaskFormValues => {
    if (!task) {
        return {
            title: "",
            description: "",
            status: "PENDING",
            priority: "MEDIUM",
            dueDate: new Date(),
            subTasks: [],
        };
    }

    return {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,

        subTasks:
            task.subTasks?.map(
                subTaskToFormValues,
            ) ?? [],
    };
};

export const formValuesToCreateTask = (
    values: TaskFormValues,
): CreateTask => ({
    title: values.title.trim(),

    description:
        values.description.trim(),

    status: values.status,

    priority: values.priority,

    dueDate: values.dueDate,
});

export const formValuesToUpdateTask = (
    id: number,
    values: TaskFormValues,
): UpdateTask => ({
    id,

    title: values.title.trim(),

    description:
        values.description.trim(),

    status: values.status,

    priority: values.priority,

    dueDate: values.dueDate,
});