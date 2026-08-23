import type {
  CreateTask,
  Task,
  TasksParamsSearch,
  UpdateTask,
} from "../types/tasks.type";
import { isTaskFromStorage } from "../types/tasks.type";

import {
  handleDeleteSubTasksByTaskIdService,
  handleListSubTasksService,
} from "@/modules/subtasks/services/subtasks.service";

const STORAGE_KEY = "tasksMap";

const getStoredTasks = (): Task[] => {
  const rawData = localStorage.getItem(STORAGE_KEY);

  if (!rawData) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawData);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(isTaskFromStorage)
      .map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: new Date(task.dueDate),
        subTasks: handleListSubTasksService(task.id),
      }));
  } catch {
    return [];
  }
};

const saveTasks = (tasks: Task[]): void => {
  const tasksWithoutSubTasks = tasks.map(({ subTasks: _subTasks, ...task }) => task);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksWithoutSubTasks));
};

export const handleListTaskService = (
  params?: TasksParamsSearch,
): Task[] => {
  const tasks = getStoredTasks();

  if (!tasks.length) return [];
  if (!params || Object.keys(params).length === 0) return tasks;

  return tasks.filter((task) => {
    if (params.name?.trim()) {
      const query = params.name.trim().toLowerCase();
      const titleMatches = task.title.toLowerCase().includes(query);
      const descriptionMatches = task.description.toLowerCase().includes(query);

      if (!titleMatches && !descriptionMatches) return false;
    }

    if (params.priority && task.priority !== params.priority) return false;
    if (params.status && task.status !== params.status) return false;

    if (params.dueDate) {
      const taskDueDateIso = task.dueDate.toISOString().split("T")[0];
      const paramDueDateIso = new Date(params.dueDate)
        .toISOString()
        .split("T")[0];

      if (taskDueDateIso !== paramDueDateIso) return false;
    }

    const createdTime = task.createdAt.getTime();

    if (params.startDate) {
      const startTime = new Date(params.startDate).getTime();
      if (!Number.isNaN(startTime) && createdTime < startTime) return false;
    }

    if (params.endDate) {
      const endTime = new Date(params.endDate).getTime();
      if (!Number.isNaN(endTime) && createdTime > endTime) return false;
    }

    return true;
  });
};

export const handleCreateTaskService = (newTaskData: CreateTask): Task => {
  const tasks = getStoredTasks();

  const newTask: Task = {
    ...newTaskData,
    id: Date.now(),
    createdAt: new Date(),
    subTasks: [],
  };

  tasks.push(newTask);
  saveTasks(tasks);

  return newTask;
};

export const handleDeleteTaskService = (taskId: number): void => {
  const tasks = getStoredTasks();
  const updatedTasks = tasks.filter((task) => task.id !== taskId);

  saveTasks(updatedTasks);
  handleDeleteSubTasksByTaskIdService(taskId);
};

export const handleUpdateTaskService = (
  taskId: number,
  updatedFields: UpdateTask,
): Task => {
  const tasks = getStoredTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    throw new Error(`Tarefa com o ID ${taskId} não foi encontrada.`);
  }

  const currentTask = tasks[taskIndex];

  const updatedTask: Task = {
    ...currentTask,
    ...updatedFields,
    dueDate: new Date(updatedFields.dueDate),
  };

  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);

  return {
    ...updatedTask,
    subTasks: handleListSubTasksService(taskId),
  };
};
