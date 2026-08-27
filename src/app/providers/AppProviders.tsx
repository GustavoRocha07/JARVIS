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
import { PaginationProvider } from "@/context/PaginationContext/PaginatioProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <PaginationProvider>

        <TimerProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </TimerProvider>
      </PaginationProvider>
    </ThemeProvider>
  );
}
