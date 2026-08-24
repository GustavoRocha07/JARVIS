import { createContext } from 'react';
import type { TimerState, TimerTarget } from '../types/timer.type';

export type TimerContextData = {
    timer: TimerState;

    startTimer: (target: TimerTarget) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    restartTimer: () => void;
    startBreak: () => void;
    skipBreak: () => void;
    finishTimer: () => void;
    resetTimer: () => void;
    isTimerOwner: (target: TimerTarget) => boolean;
};

export const TimerContext = createContext<
    TimerContextData | undefined
>(undefined);
