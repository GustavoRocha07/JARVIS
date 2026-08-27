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
    endsAt: null,
};

export type TimerAction =
    | {
        type: 'START';
        payload: {
            target: TimerTarget;
            now: number;
        };
    }
    | { type: 'PAUSE'; payload: { now: number } }
    | { type: 'RESUME'; payload: { now: number } }
    | { type: 'RESTART'; payload: { now: number } }
    | { type: 'START_BREAK'; payload: { now: number } }
    | { type: 'TICK'; payload: { now: number } }
    | { type: 'SKIP_BREAK'; payload: { now: number } }
    | { type: 'FINISH'; payload: { now: number } }
    | { type: 'RESET' };

const getRemainingSeconds = (
    endsAt: number | null,
    now: number,
    fallback: number,
) => {
    if (endsAt === null) {
        return fallback;
    }

    return Math.max(
        Math.ceil((endsAt - now) / 1000),
        0,
    );
};

const getWorkedSeconds = (
    state: TimerState,
    remainingSeconds: number,
) => {
    if (state.phase !== 'FOCUS') {
        return state.workedSeconds;
    }

    const elapsedSeconds = Math.max(
        state.remainingSeconds - remainingSeconds,
        0,
    );

    return state.workedSeconds + elapsedSeconds;
};

export const timerReducer = (
    state: TimerState,
    action: TimerAction,
): TimerState => {
    switch (action.type) {
        case 'START': {
            const { now, target } = action.payload;

            return {
                ...initialTimerState,
                target,
                status: 'RUNNING',
                startedAt: now,
                endsAt: now + FOCUS_DURATION_SECONDS * 1000,
            };
        }

        case 'PAUSE': {
            if (state.status !== 'RUNNING') {
                return state;
            }

            const remainingSeconds = getRemainingSeconds(
                state.endsAt,
                action.payload.now,
                state.remainingSeconds,
            );
            const workedSeconds = getWorkedSeconds(
                state,
                remainingSeconds,
            );

            if (remainingSeconds === 0 && state.phase === 'FOCUS') {
                return {
                    ...state,
                    status: 'WAITING_BREAK',
                    remainingSeconds: 0,
                    workedSeconds,
                    completedFocus: true,
                    pausedAt: null,
                    endsAt: null,
                };
            }

            if (remainingSeconds === 0) {
                return {
                    ...state,
                    status: 'FINISHED',
                    remainingSeconds: 0,
                    workedSeconds,
                    pausedAt: null,
                    finishedAt: action.payload.now,
                    endsAt: null,
                };
            }

            return {
                ...state,
                status: 'PAUSED',
                remainingSeconds,
                workedSeconds,
                pausedAt: action.payload.now,
                endsAt: null,
            };
        }

        case 'RESUME':
            if (state.status !== 'PAUSED') {
                return state;
            }

            return {
                ...state,
                status: 'RUNNING',
                pausedAt: null,
                endsAt: action.payload.now + state.remainingSeconds * 1000,
            };

        case 'RESTART': {
            if (!state.target || state.status === 'IDLE' || state.status === 'FINISHED') {
                return state;
            }

            const isFocus = state.phase === 'FOCUS';
            const duration = isFocus
                ? FOCUS_DURATION_SECONDS
                : BREAK_DURATION_SECONDS;

            return {
                ...state,
                status: 'RUNNING',
                duration,
                remainingSeconds: duration,
                workedSeconds: isFocus ? 0 : state.workedSeconds,
                completedFocus: isFocus ? false : state.completedFocus,
                startedAt: isFocus ? action.payload.now : state.startedAt,
                pausedAt: null,
                finishedAt: null,
                endsAt: action.payload.now + duration * 1000,
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
                endsAt: action.payload.now + BREAK_DURATION_SECONDS * 1000,
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
                finishedAt: action.payload.now,
                endsAt: null,
            };

        case 'FINISH': {
            if (state.status === 'IDLE' || state.status === 'FINISHED') {
                return state;
            }

            const remainingSeconds = state.status === 'RUNNING'
                ? getRemainingSeconds(
                    state.endsAt,
                    action.payload.now,
                    state.remainingSeconds,
                )
                : state.remainingSeconds;
            const workedSeconds = state.status === 'RUNNING'
                ? getWorkedSeconds(state, remainingSeconds)
                : state.workedSeconds;

            return {
                ...state,
                status: 'FINISHED',
                remainingSeconds,
                workedSeconds,
                pausedAt: null,
                finishedAt: action.payload.now,
                endsAt: null,
            };
        }

        case 'TICK': {
            if (state.status !== 'RUNNING') {
                return state;
            }

            const remainingSeconds = getRemainingSeconds(
                state.endsAt,
                action.payload.now,
                state.remainingSeconds,
            );
            const workedSeconds = getWorkedSeconds(
                state,
                remainingSeconds,
            );

            if (remainingSeconds === 0 && state.phase === 'FOCUS') {
                return {
                    ...state,
                    status: 'WAITING_BREAK',
                    remainingSeconds: 0,
                    workedSeconds,
                    completedFocus: true,
                    endsAt: null,
                };
            }

            if (remainingSeconds === 0) {
                return {
                    ...state,
                    status: 'FINISHED',
                    remainingSeconds: 0,
                    workedSeconds,
                    finishedAt: action.payload.now,
                    endsAt: null,
                };
            }

            return {
                ...state,
                remainingSeconds,
                workedSeconds,
            };
        }

        default:
            return state;
    }
};
