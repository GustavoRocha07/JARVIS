import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  initialTimerState,
  timerReducer,
} from "./timer.reducer";
import type { TimerTarget } from "../types/timer.type";
import { TimerContext } from "./timerContext";
import { TimerSessionsContext } from "./timerSessionsContext";
import { canInitTimer } from "../rules/timer.rules";
import {
  handleCreateTimerSessionService,
  handleListTimerSessionsService,
} from "../services/timer-session.service";

type TimerProviderProps = {
  children: ReactNode;
};

const isSameTarget = (
  currentTarget: TimerTarget | null,
  target: TimerTarget,
) => {
  if (!currentTarget) {
    return false;
  }

  if (target.type === "TASK") {
    return (
      currentTarget.type === "TASK" &&
      currentTarget.taskId === target.taskId
    );
  }

  return (
    currentTarget.type === "SUBTASK" &&
    currentTarget.taskId === target.taskId &&
    currentTarget.subTaskId === target.subTaskId
  );
};

const getSessionKey = (
  target: TimerTarget,
  startedAt: number,
) => {
  if (target.type === "TASK") {
    return `TASK:${target.taskId}:${startedAt}`;
  }

  return `SUBTASK:${target.taskId}:${target.subTaskId}:${startedAt}`;
};

export const TimerProvider = ({
  children,
}: TimerProviderProps) => {
  const [timer, dispatch] = useReducer(
    timerReducer,
    initialTimerState,
  );
  const [sessions, setSessions] = useState(() =>
    handleListTimerSessionsService(),
  );
  const savedSessionKeyRef = useRef<string | null>(null);

  const refreshTimerSessions = useCallback(() => {
    setSessions(handleListTimerSessionsService());
  }, []);

  const startTimer = (
    target: TimerTarget,
  ) => {
    if (!canInitTimer(timer)) return;

    savedSessionKeyRef.current = null;

    dispatch({
      type: "START",
      payload: {
        target,
      },
    });
  };

  const pauseTimer = () => {
    dispatch({ type: "PAUSE" });
  };

  const resumeTimer = () => {
    dispatch({ type: "RESUME" });
  };

  const restartTimer = () => {
    savedSessionKeyRef.current = null;
    dispatch({ type: "RESTART" });
  };

  const startBreak = () => {
    dispatch({ type: "START_BREAK" });
  };

  const skipBreak = () => {
    dispatch({ type: "SKIP_BREAK" });
  };

  const finishTimer = () => {
    dispatch({ type: "FINISH" });
  };

  const resetTimer = () => {
    dispatch({ type: "RESET" });
    savedSessionKeyRef.current = null;
  };

  const isTimerOwner = (target: TimerTarget) => {
    return isSameTarget(timer.target, target);
  };

  useEffect(() => {
    if (timer.status !== "RUNNING") {
      return;
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timer.status]);

  useEffect(() => {
    if (
      timer.status !== "FINISHED" ||
      !timer.target ||
      timer.startedAt === null ||
      timer.finishedAt === null
    ) {
      return;
    }

    const sessionKey = getSessionKey(
      timer.target,
      timer.startedAt,
    );

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
    refreshTimerSessions();
  }, [refreshTimerSessions, timer]);

  const timerSessionsValue = useMemo(
    () => ({
      sessions,
      refreshTimerSessions,
    }),
    [refreshTimerSessions, sessions],
  );

  return (
    <TimerSessionsContext.Provider value={timerSessionsValue}>
      <TimerContext.Provider
        value={{
          timer,
          startTimer,
          pauseTimer,
          resumeTimer,
          restartTimer,
          startBreak,
          skipBreak,
          finishTimer,
          resetTimer,
          isTimerOwner,
        }}
      >
        {children}
      </TimerContext.Provider>
    </TimerSessionsContext.Provider>
  );
};
