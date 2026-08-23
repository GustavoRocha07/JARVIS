import {
  type ReactNode,
} from "react";

import {
  AlertProvider,
} from "@/context/AlertContext/AlertProvider";
import {
  ThemeProvider,
} from "@/context/ThemeContext/ThemeProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AlertProvider>
        {children}
      </AlertProvider>
    </ThemeProvider>
  );
}
