import {
  type ReactNode,
} from "react";

import {
  AlertProvider,
} from "@/context/AlertContext/AlertProvider";
import {
  ThemeProvider,
} from "@/context/ThemeContext/ThemeProvider";
import { TimerProvider } from "@/modules/timer/contexts/TimerProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <TimerProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </TimerProvider>
    </ThemeProvider>
  );
}
