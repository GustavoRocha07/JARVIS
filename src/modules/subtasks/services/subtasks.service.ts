import type {
  CreateSubTask,
  SubTask,
  UpdateSubTask,
} from "../types/subtask.type";

const STORAGE_KEY = "jarvis:subtasks";

type StoredSubTask = Omit<SubTask, "createdAt"> & {
  createdAt: string;
};

const isStoredSubTask = (value: unknown): value is StoredSubTask => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("id" in value)) return false;
  if (!("taskId" in value)) return false;
  if (!("title" in value)) return false;
  if (!("description" in value)) return false;
  if (!("status" in value)) return false;
  if (!("priority" in value)) return false;
  if (!("completed" in value)) return false;
  if (!("createdAt" in value)) return false;

  const status = value.status;
  const priority = value.priority;
  const createdAt = value.createdAt;

  const validStatus =
    status === "PENDING" ||
    status === "IN_PROGRESS" ||
    status === "COMPLETED" ||
    status === "CANCELLED";

  const validPriority =
    priority === "LOW" ||
    priority === "MEDIUM" ||
    priority === "HIGH" ||
    priority === "URGENT";

  return (
    typeof value.id === "string" &&
    typeof value.taskId === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    validStatus &&
    validPriority &&
    typeof value.completed === "boolean" &&
    typeof createdAt === "string" &&
    !Number.isNaN(new Date(createdAt).getTime())
  );
};

const getStoredSubTasks = (): SubTask[] => {
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
      .filter(isStoredSubTask)
      .map((subTask) => ({
        ...subTask,
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

  if (taskId === undefined) {
    return subTasks;
  }

  return subTasks.filter((subTask) => subTask.taskId === taskId);
};

export const handleCreateSubTaskService = (
  data: CreateSubTask,
): SubTask => {
  const subTasks = getStoredSubTasks();

  const newSubTask: SubTask = {
    id: crypto.randomUUID(),
    taskId: data.taskId,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    completed: data.status === "COMPLETED",
    createdAt: new Date(),
  };

  saveSubTasks([...subTasks, newSubTask]);

  return newSubTask;
};

export const handleUpdateSubTaskService = (
  data: UpdateSubTask,
): SubTask => {
  const subTasks = getStoredSubTasks();
  const index = subTasks.findIndex((subTask) => subTask.id === data.id);

  if (index === -1) {
    throw new Error(`Subtarefa com o ID ${data.id} não foi encontrada.`);
  }

  const updatedSubTask: SubTask = {
    ...subTasks[index],
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    completed: data.completed,
  };

  subTasks[index] = updatedSubTask;
  saveSubTasks(subTasks);

  return updatedSubTask;
};

export const handleDeleteSubTaskService = (subTaskId: string): void => {
  const subTasks = getStoredSubTasks();
  saveSubTasks(subTasks.filter((subTask) => subTask.id !== subTaskId));
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

  const syncedSubTasks = values.map((value): SubTask => {
    const current = value.id ? currentById.get(value.id) : undefined;

    if (current) {
      return {
        ...current,
        title: value.title.trim(),
        description: value.description.trim(),
        status: value.status,
        priority: value.priority,
        completed: value.status === "COMPLETED",
      };
    }

    return {
      id: crypto.randomUUID(),
      taskId,
      title: value.title.trim(),
      description: value.description.trim(),
      status: value.status,
      priority: value.priority,
      completed: value.status === "COMPLETED",
      createdAt: new Date(),
    };
  });

  saveSubTasks([...unrelatedSubTasks, ...syncedSubTasks]);

  return syncedSubTasks;
};
