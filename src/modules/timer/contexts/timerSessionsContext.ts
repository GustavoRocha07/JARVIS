import { createContext } from "react";

import type { TimerSession } from "../types/timer-session.type";

export type TimerSessionsContextData = {
  sessions: TimerSession[];
  refreshTimerSessions: () => void;
};

export const TimerSessionsContext = createContext<
  TimerSessionsContextData | undefined
>(undefined);
