import {
    BREAK_DURATION_SECONDS,
    FOCUS_DURATION_SECONDS,
} from "../constants/timer.constants";
import type { TimerState, TimerTarget } from "../types/timer.type";

export const initialTimerState: TimerState = {
    target: null,
    status: 'IDLE',
    phase: 'FOCUS',

    duration: FOCUS_DURATION_SECONDS,
    remainingSeconds: FOCUS_DURATION_SECONDS,
    workedSeconds: 0,
    completedFocus: false,

    startedAt: null,
    pausedAt: null,
    finishedAt: null,
};

export type TimerAction =
    | {
        type: 'START';
        payload: {
            target: TimerTarget;
        };
    }
    | { type: 'PAUSE' }
    | { type: 'RESUME' }
    | { type: 'RESTART' }
    | { type: 'START_BREAK' }
    | { type: 'TICK' }
    | { type: 'SKIP_BREAK' }
    | { type: 'FINISH' }
    | { type: 'RESET' };

export const timerReducer = (
    state: TimerState,
    action: TimerAction,
): TimerState => {
    switch (action.type) {
        case 'START':
            return {
                ...initialTimerState,
                target: action.payload.target,
                status: 'RUNNING',
                startedAt: Date.now(),
            };

        case 'PAUSE':
            if (state.status !== 'RUNNING') {
                return state;
            }

            return {
                ...state,
                status: 'PAUSED',
                pausedAt: Date.now(),
            };

        case 'RESUME':
            if (state.status !== 'PAUSED') {
                return state;
            }

            return {
                ...state,
                status: 'RUNNING',
                pausedAt: null,
            };

        case 'RESTART': {
            if (!state.target || state.status === 'IDLE' || state.status === 'FINISHED') {
                return state;
            }

            const isFocus = state.phase === 'FOCUS';

            return {
                ...state,
                status: 'RUNNING',
                duration: isFocus
                    ? FOCUS_DURATION_SECONDS
                    : BREAK_DURATION_SECONDS,
                remainingSeconds: isFocus
                    ? FOCUS_DURATION_SECONDS
                    : BREAK_DURATION_SECONDS,
                workedSeconds: isFocus ? 0 : state.workedSeconds,
                completedFocus: isFocus ? false : state.completedFocus,
                startedAt: isFocus ? Date.now() : state.startedAt,
                pausedAt: null,
                finishedAt: null,
            };
        }

        case 'START_BREAK':
            if (
                state.status !== 'WAITING_BREAK' ||
                state.phase !== 'FOCUS' ||
                !state.completedFocus
            ) {
                return state;
            }

            return {
                ...state,
                phase: 'BREAK',
                status: 'RUNNING',
                duration: BREAK_DURATION_SECONDS,
                remainingSeconds: BREAK_DURATION_SECONDS,
                pausedAt: null,
            };

        case 'RESET':
            return initialTimerState;

        case 'SKIP_BREAK':
            if (state.phase !== 'BREAK' || state.status === 'FINISHED') {
                return state;
            }

            return {
                ...state,
                status: 'FINISHED',
                remainingSeconds: 0,
                finishedAt: Date.now(),
            };

        case 'FINISH':
            if (state.status === 'IDLE' || state.status === 'FINISHED') {
                return state;
            }

            return {
                ...state,
                status: 'FINISHED',
                finishedAt: Date.now(),
            };

        case 'TICK': {
            if (state.status !== 'RUNNING') {
                return state;
            }

            const nextRemainingSeconds = Math.max(
                state.remainingSeconds - 1,
                0,
            );

            const workedSeconds = state.phase === 'FOCUS'
                ? state.workedSeconds + 1
                : state.workedSeconds;

            if (nextRemainingSeconds === 0 && state.phase === 'FOCUS') {
                return {
                    ...state,
                    status: 'WAITING_BREAK',
                    remainingSeconds: 0,
                    workedSeconds,
                    completedFocus: true,
                };
            }

            if (nextRemainingSeconds === 0) {
                return {
                    ...state,
                    status: 'FINISHED',
                    remainingSeconds: 0,
                    finishedAt: Date.now(),
                };
            }

            return {
                ...state,
                remainingSeconds: nextRemainingSeconds,
                workedSeconds,
            };
        }

        default:
            return state;
    }
};
