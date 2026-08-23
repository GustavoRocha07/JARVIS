import { createContext } from "react";

export type ThemeMode = "light" | "dark";

export type ThemeContextValue = {
    mode: ThemeMode;
    isDarkMode: boolean;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
};

export const ThemeContext =
    createContext<ThemeContextValue | undefined>(
        undefined,
    );
