import { useContext } from "react";

import { TimerSessionsContext } from "./timerSessionsContext";

export const useTimerSessions = () => {
  const context = useContext(TimerSessionsContext);

  if (!context) {
    throw new Error(
      "useTimerSessions deve ser utilizado dentro de um TimerProvider",
    );
  }

  return context;
};
