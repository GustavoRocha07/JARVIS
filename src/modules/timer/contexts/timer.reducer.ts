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
    | {
        type: 'PAUSE';
    }
    | {
        type: 'RESUME';
    }
    | {
        type: 'TICK';
    }
    | {
        type: 'SKIP_BREAK';
    }
    | {
        type: 'FINISH';
    }
    | {
        type: 'RESET';
    };

export const timerReducer = (
    state: TimerState,
    action: TimerAction,
): TimerState => {
    switch (action.type) {
        case 'START':
            return {
                ...state,

                target: action.payload.target,

                status: 'RUNNING',
                phase: 'FOCUS',

                duration: FOCUS_DURATION_SECONDS,
                remainingSeconds: FOCUS_DURATION_SECONDS,
                workedSeconds: 0,
                completedFocus: false,

                startedAt: Date.now(),

                pausedAt: null,
                finishedAt: null,
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

            const nextRemainingSeconds =
                Math.max(state.remainingSeconds - 1, 0);

            const workedSeconds = state.phase === 'FOCUS'
                ? state.workedSeconds + 1
                : state.workedSeconds;

            if (nextRemainingSeconds === 0 && state.phase === 'FOCUS') {
                return {
                    ...state,
                    phase: 'BREAK',
                    duration: BREAK_DURATION_SECONDS,
                    remainingSeconds: BREAK_DURATION_SECONDS,
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
            }
        }


        default:
            return state;
    }
};
