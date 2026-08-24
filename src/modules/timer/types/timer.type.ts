export type TimerStatus =
    | 'IDLE'
    | 'RUNNING'
    | 'PAUSED'
    | 'FINISHED';

export type TimerPhase =
    | 'FOCUS'
    | 'BREAK';

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
    phase: TimerPhase;

    duration: number;
    remainingSeconds: number;
    workedSeconds: number;
    completedFocus: boolean;

    startedAt: number | null;
    pausedAt: number | null;
    finishedAt: number | null;
};
