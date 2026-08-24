import {
    useEffect,
    useReducer,
    type ReactNode,
} from 'react';


import {
    initialTimerState,
    timerReducer,
} from './timer.reducer';
import type { TimerTarget } from '../types/timer.type';
import { TimerContext } from './timerContext';
import { canInitTimer } from '../rules/timer.rules';



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

    return (
        <TimerContext.Provider
            value={{
                timer,
                startTimer,
                pauseTimer,
                resumeTimer,
                resetTimer,
                isTimerOwner,
            }
            }
        >
            {children}
        </TimerContext.Provider>
    );
};