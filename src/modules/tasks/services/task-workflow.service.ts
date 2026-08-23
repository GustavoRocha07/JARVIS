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
  handleUpdateTaskService,
} from "./tasks.service";

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

  handleUpdateTaskService(payload.task.id, payload.task);
  handleSyncTaskSubTasksService(payload.task.id, payload.subTasks);
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
