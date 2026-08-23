import {
    type PropsWithChildren,
    useCallback,
    useMemo,
    useState,
} from "react";

import {
    CssBaseline,
    ThemeProvider as MuiThemeProvider,
} from "@mui/material";

import {
    createAppTheme,
} from "@/app/theme/theme";

import {
    ThemeContext,
    type ThemeMode,
} from "./ThemeContext";

const STORAGE_KEY = "jarvis:theme";

const getInitialThemeMode = (): ThemeMode => {
    const storedMode = localStorage.getItem(
        STORAGE_KEY,
    );

    if (
        storedMode === "light" ||
        storedMode === "dark"
    ) {
        return storedMode;
    }

    return window.matchMedia?.(
        "(prefers-color-scheme: dark)",
    ).matches
        ? "dark"
        : "light";
};

export const ThemeProvider = ({
    children,
}: PropsWithChildren) => {
    const [mode, setMode] =
        useState<ThemeMode>(
            getInitialThemeMode,
        );

    const setThemeMode = useCallback(
        (newMode: ThemeMode) => {
            setMode(newMode);
            localStorage.setItem(
                STORAGE_KEY,
                newMode,
            );
        },
        [],
    );

    const toggleTheme = useCallback(() => {
        setMode((currentMode) => {
            const nextMode =
                currentMode === "light"
                    ? "dark"
                    : "light";

            localStorage.setItem(
                STORAGE_KEY,
                nextMode,
            );

            return nextMode;
        });
    }, []);

    const theme = useMemo(
        () => createAppTheme(mode),
        [mode],
    );

    const value = useMemo(
        () => ({
            mode,
            isDarkMode: mode === "dark",
            toggleTheme,
            setThemeMode,
        }),
        [
            mode,
            toggleTheme,
            setThemeMode,
        ],
    );

    return (
        <ThemeContext.Provider
            value={value}
        >
            <MuiThemeProvider
                theme={theme}
            >
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
