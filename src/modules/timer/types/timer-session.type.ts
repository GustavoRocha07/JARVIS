import type { TimerTarget } from "./timer.type";

export type TimerSession = {
    id: string;
    target: TimerTarget;
    startedAt: Date;
    finishedAt: Date;
    workedSeconds: number;
    completedFocus: boolean;
};

export type CreateTimerSession = Omit<TimerSession, "id">;
