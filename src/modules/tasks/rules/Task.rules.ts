import type { Task } from '../types/tasks.type';

export const canCompleteTask = (task: Task): boolean => {
    const isFinished =
        task.status === 'CANCELLED' ||
        task.status === 'COMPLETED';

    const hasOpenSubtask = task.subTasks?.some(
        ({ status }) =>
            status === 'IN_PROGRESS' ||
            status === 'PENDING',
    );

    return !isFinished && !hasOpenSubtask;
};