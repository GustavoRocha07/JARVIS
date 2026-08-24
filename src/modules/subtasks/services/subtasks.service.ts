import type {
  CreateSubTask,
  SubTask,
  UpdateSubTask,
} from "../types/subtask.type";
import {
  isTaskPriority,
  isTaskStatus,
} from "@/shared/types/task-domain.type";
import { handleDeleteTimerSessionsBySubTaskIdService } from "@/modules/timer/services/timer-session.service";

const STORAGE_KEY = "jarvis:subtasks";

type StoredSubTask = Omit<SubTask, "createdAt"> & {
  createdAt: string;
  completed?: boolean;
};

const isStoredSubTask = (value: unknown): value is StoredSubTask => {
  if (typeof value !== "object" || value === null) return false;

  if (!("id" in value)) return false;
  if (!("taskId" in value)) return false;
  if (!("title" in value)) return false;
  if (!("description" in value)) return false;
  if (!("status" in value)) return false;
  if (!("priority" in value)) return false;
  if (!("createdAt" in value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.taskId === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    isTaskStatus(value.status) &&
    isTaskPriority(value.priority) &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(new Date(value.createdAt).getTime())
  );
};

const getStoredSubTasks = (): SubTask[] => {
  const rawData = localStorage.getItem(STORAGE_KEY);

  if (!rawData) return [];

  try {
    const parsed: unknown = JSON.parse(rawData);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isStoredSubTask).map((subTask) => ({
      id: subTask.id,
      taskId: subTask.taskId,
      title: subTask.title,
      description: subTask.description,
      status: subTask.status,
      priority: subTask.priority,
      createdAt: new Date(subTask.createdAt),
    }));
  } catch {
    return [];
  }
};

const saveSubTasks = (subTasks: SubTask[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subTasks));
};

export const handleListSubTasksService = (taskId?: number): SubTask[] => {
  const subTasks = getStoredSubTasks();

  if (taskId === undefined) return subTasks;

  return subTasks.filter((subTask) => subTask.taskId === taskId);
};

export const handleCreateSubTaskService = (data: CreateSubTask): SubTask => {
  const subTasks = getStoredSubTasks();

  const newSubTask: SubTask = {
    id: crypto.randomUUID(),
    taskId: data.taskId,
    title: data.title.trim(),
    description: data.description.trim(),
    status: data.status,
    priority: data.priority,
    createdAt: new Date(),
  };

  saveSubTasks([...subTasks, newSubTask]);

  return newSubTask;
};

export const handleUpdateSubTaskService = (data: UpdateSubTask): SubTask => {
  const subTasks = getStoredSubTasks();
  const index = subTasks.findIndex((subTask) => subTask.id === data.id);

  if (index === -1) {
    throw new Error(`Subtarefa com o ID ${data.id} não foi encontrada.`);
  }

  const updatedSubTask: SubTask = {
    ...subTasks[index],
    title: data.title.trim(),
    description: data.description.trim(),
    status: data.status,
    priority: data.priority,
  };

  subTasks[index] = updatedSubTask;
  saveSubTasks(subTasks);

  return updatedSubTask;
};

export const handleDeleteSubTaskService = (subTaskId: string): void => {
  const subTasks = getStoredSubTasks();
  const subTask = subTasks.find((item) => item.id === subTaskId);

  saveSubTasks(subTasks.filter((item) => item.id !== subTaskId));

  if (subTask) {
    handleDeleteTimerSessionsBySubTaskIdService(subTask.taskId, subTask.id);
  }
};

export const handleDeleteSubTasksByTaskIdService = (taskId: number): void => {
  const subTasks = getStoredSubTasks();
  saveSubTasks(subTasks.filter((subTask) => subTask.taskId !== taskId));
};

export const handleSyncTaskSubTasksService = (
  taskId: number,
  values: Array<{
    id?: string;
    title: string;
    description: string;
    status: SubTask["status"];
    priority: SubTask["priority"];
  }>,
): SubTask[] => {
  const allSubTasks = getStoredSubTasks();
  const currentTaskSubTasks = allSubTasks.filter(
    (subTask) => subTask.taskId === taskId,
  );
  const unrelatedSubTasks = allSubTasks.filter(
    (subTask) => subTask.taskId !== taskId,
  );

  const currentById = new Map(
    currentTaskSubTasks.map((subTask) => [subTask.id, subTask]),
  );
  const keptIds = new Set(
    values.flatMap((value) => (value.id ? [value.id] : [])),
  );

  currentTaskSubTasks
    .filter((subTask) => !keptIds.has(subTask.id))
    .forEach((subTask) => {
      handleDeleteTimerSessionsBySubTaskIdService(taskId, subTask.id);
    });

  const syncedSubTasks = values.map((value): SubTask => {
    const current = value.id ? currentById.get(value.id) : undefined;

    if (current) {
      return {
        ...current,
        title: value.title.trim(),
        description: value.description.trim(),
        status: value.status,
        priority: value.priority,
      };
    }

    return {
      id: crypto.randomUUID(),
      taskId,
      title: value.title.trim(),
      description: value.description.trim(),
      status: value.status,
      priority: value.priority,
      createdAt: new Date(),
    };
  });

  saveSubTasks([...unrelatedSubTasks, ...syncedSubTasks]);

  return syncedSubTasks;
};
