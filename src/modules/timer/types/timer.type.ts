export type TimerStatus =
    | 'IDLE'
    | 'RUNNING'
    | 'PAUSED'
    | 'FINISHED';

export type TimerTargetType =
    | 'TASK'
    | 'SUBTASK';

export type TimerTarget = {
    id: number | string;
    type: TimerTargetType;
};

export type TimerState = {
    target: TimerTarget | null;
    status: TimerStatus;

    duration: number;
    remainingSeconds: number;

    startedAt: number | null;
    pausedAt: number | null;
};
