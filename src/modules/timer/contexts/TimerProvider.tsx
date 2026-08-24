import {
    useEffect,
    useReducer,
    useRef,
    type ReactNode,
} from 'react';


import {
    initialTimerState,
    timerReducer,
} from './timer.reducer';
import type { TimerTarget } from '../types/timer.type';
import { TimerContext } from './timerContext';
import { canInitTimer } from '../rules/timer.rules';
import { handleCreateTimerSessionService } from '../services/timer-session.service';



type TimerProviderProps = {
    children: ReactNode;
};

export const TimerProvider = ({
    children,
}: TimerProviderProps) => {
    const [timer, dispatch] = useReducer(
        timerReducer,
        initialTimerState,
    );
    const savedSessionKeyRef = useRef<string | null>(null);

    const startTimer = (
        target: TimerTarget,
    ) => {

        if (!canInitTimer(timer)) return;

        dispatch({
            type: 'START',
            payload: {
                target,
            },
        });
    };

    const pauseTimer = () => {
        dispatch({
            type: 'PAUSE',
        });
    };

    const resumeTimer = () => {
        dispatch({
            type: 'RESUME',
        });
    };

    const skipBreak = () => {
        dispatch({
            type: 'SKIP_BREAK',
        });
    };

    const finishTimer = () => {
        dispatch({
            type: 'FINISH',
        });
    };

    const resetTimer = () => {
        dispatch({
            type: 'RESET',
        });
    };

    const isTimerOwner = (target: TimerTarget) => {
        return (
            timer.target?.id === target.id &&
            timer.target?.type === target.type
        );
    };

    useEffect(() => {
        if (timer.status !== 'RUNNING') {
            return;
        }

        const intervalId = window.setInterval(() => {
            dispatch({
                type: 'TICK',
            });
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [timer.status]);

    useEffect(() => {
        if (
            timer.status !== 'FINISHED' ||
            !timer.target ||
            timer.startedAt === null ||
            timer.finishedAt === null
        ) {
            return;
        }

        const sessionKey = [
            timer.target.type,
            timer.target.id,
            timer.startedAt,
        ].join(':');

        if (savedSessionKeyRef.current === sessionKey) {
            return;
        }

        handleCreateTimerSessionService({
            target: timer.target,
            startedAt: new Date(timer.startedAt),
            finishedAt: new Date(timer.finishedAt),
            workedSeconds: timer.workedSeconds,
            completedFocus: timer.completedFocus,
        });

        savedSessionKeyRef.current = sessionKey;
    }, [timer]);

    return (
        <TimerContext.Provider
            value={{
                timer,
                startTimer,
                pauseTimer,
                resumeTimer,
                skipBreak,
                finishTimer,
                resetTimer,
                isTimerOwner,
            }
            }
        >
            {children}
        </TimerContext.Provider>
    );
};
