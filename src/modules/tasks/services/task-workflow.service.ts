import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import { formValuesToCreateSubTask } from "@/modules/subtasks/mappers/subtask.mapper";
import {
  handleCreateSubTaskService,
  handleSyncTaskSubTasksService,
  handleUpdateSubTaskService,
} from "@/modules/subtasks/services/subtasks.service";

import type { TaskSubmit } from "../types/tasks.type";
import {
  handleCreateTaskService,
  handleDeleteTaskService,
  handleListTaskService,
  handleUpdateTaskService,
} from "./tasks.service";

const restoreTaskSnapshot = (
  taskId: number,
  snapshot: ReturnType<typeof handleListTaskService>[number],
) => {
  handleUpdateTaskService(taskId, {
    id: snapshot.id,
    title: snapshot.title,
    description: snapshot.description,
    status: snapshot.status,
    priority: snapshot.priority,
    dueDate: snapshot.dueDate,
  });

  handleSyncTaskSubTasksService(
    taskId,
    (snapshot.subTasks ?? []).map((subTask) => ({
      id: subTask.id,
      title: subTask.title,
      description: subTask.description,
      status: subTask.status,
      priority: subTask.priority,
    })),
  );
};

export const handleSubmitTaskWorkflow = (payload: TaskSubmit): void => {
  if (payload.action === "CREATE") {
    const createdTask = handleCreateTaskService(payload.task);

    try {
      payload.subTasks.forEach((subTask) => {
        handleCreateSubTaskService(
          formValuesToCreateSubTask(createdTask.id, subTask),
        );
      });
    } catch (error) {
      handleDeleteTaskService(createdTask.id);
      throw error;
    }

    return;
  }

  const currentTask = handleListTaskService({}).find(
    (task) => task.id === payload.task.id,
  );

  if (!currentTask) {
    throw new Error(
      `Tarefa com o ID ${payload.task.id} não foi encontrada.`,
    );
  }

  try {
    handleUpdateTaskService(payload.task.id, payload.task);
    handleSyncTaskSubTasksService(payload.task.id, payload.subTasks);
  } catch (error) {
    try {
      restoreTaskSnapshot(payload.task.id, currentTask);
    } catch {
      // Mantém o erro original como causa principal da operação.
    }

    throw error;
  }
};

export const handleSetSubTaskCompletionWorkflow = (
  subTask: SubTask,
  completed: boolean,
): SubTask =>
  handleUpdateSubTaskService({
    id: subTask.id,
    title: subTask.title,
    description: subTask.description,
    status: completed ? "COMPLETED" : "PENDING",
    priority: subTask.priority,
  });
