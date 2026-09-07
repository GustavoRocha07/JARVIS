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
    const ownsTaskTimer = isTimerOwner({
        type: "TASK",
        taskId: task.id,
    });

    const timerStatusLabel = timer.status === "PAUSED"
        ? "Pausado"
        : timer.status === "WAITING_BREAK"
            ? "Foco concluído"
            : timer.status === "FINISHED"
                ? "Finalizado"
                : timer.phase === "BREAK"
                    ? "Em pausa"
                    : "Em foco";

    const completeTask = (completed: boolean) => {
        onComplete(task, completed);
    };

    const completeSubTask = (
        subTask: SubTask,
        completed: boolean,
    ) => {
        onSubTaskComplete?.(subTask, completed);
    };

    return {
        state: {
            timer,
            progress,
            subtasks,
            isCompleted,
            ownsTaskTimer,
            totalSubtasks,
            timerStatusLabel,
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
