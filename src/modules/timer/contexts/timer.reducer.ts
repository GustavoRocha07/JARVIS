import { TOMATO_DURATION_SECONDS } from "../constants/timer.constants";
import type { TimerState, TimerTarget } from "../types/timer.type";




export const initialTimerState: TimerState = {
    target: null,
    status: 'IDLE',

    duration: TOMATO_DURATION_SECONDS,
    remainingSeconds: TOMATO_DURATION_SECONDS,

    startedAt: null,
    pausedAt: null,
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

                remainingSeconds: state.duration,

                startedAt: Date.now(),

                pausedAt: null,
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

        case 'TICK': {
            if (state.status !== 'RUNNING') {
                return state;
            }

            const nextRemainingSeconds =
                Math.max(state.remainingSeconds - 1, 0);

            return {
                ...state,
                remainingSeconds: nextRemainingSeconds,
                status:
                    nextRemainingSeconds === 0
                        ? 'FINISHED'
                        : state.status,
            }
        }


        default:
            return state;
    }
};
