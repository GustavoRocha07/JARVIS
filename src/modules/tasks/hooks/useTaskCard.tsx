import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "../types/tasks.type";
import { useTimer } from "@/modules/timer/contexts/useTimer";

type useTaskCardProps = {
    task: Task;
    onComplete: (task: Task, completed: boolean) => void;
    onOpenTimer: (target: Task | SubTask) => void;
    onSubTaskComplete?: (subTask: SubTask, completed: boolean) => void;
}

const isSubTaskCompleted = (subTask: SubTask) =>
    subTask.status === "COMPLETED";


export const useTaskCard = ({ onComplete,
    task, onSubTaskComplete
}: useTaskCardProps) => {
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


    const handleCompleteChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        event.stopPropagation();
        onComplete(task, event.target.checked);
    };

    const handleSubTaskChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        subTask: SubTask,
    ) => {
        event.stopPropagation();
        onSubTaskComplete?.(subTask, event.target.checked);
    };

    return {
        state: {
            timer,
            progress,
            subtasks,
            isCompleted,
            isTimerOwner,
            ownsTaskTimer,
            totalSubtasks,
            timerStatusLabel,
            completedSubtasks,
        },
        actions: {
            handleCompleteChange,
            handleSubTaskChange,
            isSubTaskCompleted,
        }
    }
}