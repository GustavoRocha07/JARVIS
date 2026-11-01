import { isBefore, isValid, subMonths } from "date-fns";
import type { Task } from "../types/tasks.type";

/** Uma tarefa concluída só expira após um mês completo do vencimento. */
export const shouldDeleteExpiredTask = (
  task: Pick<Task, "status" | "dueDate">,
  now: Date = new Date(),
): boolean => {
  if (task.status !== "COMPLETED") return false;

  const dueDate = new Date(task.dueDate);
  if (!isValid(dueDate) || !isValid(now)) return false;

  return isBefore(dueDate, subMonths(now, 1));
};
