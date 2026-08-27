export type TimerStatus =
    | 'IDLE'
    | 'RUNNING'
    | 'PAUSED'
    | 'WAITING_BREAK'
    | 'FINISHED';

export type TimerPhase =
    | 'FOCUS'
    | 'BREAK';

export type TaskTimerTarget = {
    type: 'TASK';
    taskId: number;
};

export type SubTaskTimerTarget = {
    type: 'SUBTASK';
    taskId: number;
    subTaskId: string;
};

export type TimerTarget =
    | TaskTimerTarget
    | SubTaskTimerTarget;

export type TimerState = {
    target: TimerTarget | null;
    status: TimerStatus;
    phase: TimerPhase;

    duration: number;
    remainingSeconds: number;
    workedSeconds: number;
    completedFocus: boolean;

    startedAt: number | null;
    pausedAt: number | null;
    finishedAt: number | null;
    endsAt: number | null;
};
