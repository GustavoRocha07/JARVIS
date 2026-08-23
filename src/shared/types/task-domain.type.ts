export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export const isTaskStatus = (value: unknown): value is TaskStatus =>
  value === "PENDING" ||
  value === "IN_PROGRESS" ||
  value === "COMPLETED" ||
  value === "CANCELLED";

export const isTaskPriority = (value: unknown): value is TaskPriority =>
  value === "LOW" ||
  value === "MEDIUM" ||
  value === "HIGH" ||
  value === "URGENT";
