import { useTimer } from "@/modules/timer/contexts/useTimer";
import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "../types/tasks.type";

type UseTaskCardProps = {
  task: Task;
  onComplete: (task: Task, completed: boolean) => void;
  onSubTaskComplete?: (subTask: SubTask, completed: boolean) => void;
};

const isSubTaskCompleted = (subTask: SubTask) =>
  subTask.status === "COMPLETED";

export const useTaskCard = ({
  task,
  onComplete,
  onSubTaskComplete,
}: UseTaskCardProps) => {
  const subtasks = task.subTasks ?? [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(isSubTaskCompleted).length;
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const { timer, isTimerOwner } = useTimer();
  const isCompleted = task.status === "COMPLETED";
  const isCancelled = task.status === "CANCELLED";
  const ownsTaskTimer = isTimerOwner({
    type: "TASK",
    taskId: task.id,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const isOverdue = !isCompleted && !isCancelled && dueDate < today;

  const completeTask = (completed: boolean) => {
    onComplete(task, completed);
  };

  const completeSubTask = (subTask: SubTask, completed: boolean) => {
    onSubTaskComplete?.(subTask, completed);
  };

  return {
    state: {
      timer,
      progress,
      subtasks,
      isCompleted,
      isCancelled,
      isOverdue,
      ownsTaskTimer,
      totalSubtasks,
      completedSubtasks,
    },
    actions: {
      completeTask,
      completeSubTask,
    },
    selectors: {
      isTimerOwner,
      isSubTaskCompleted,
    },
  };
};
