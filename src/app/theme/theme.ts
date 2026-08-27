import {
  createTheme,
  type ThemeOptions,
} from "@mui/material/styles";

import type {
  ThemeMode,
} from "@/context/ThemeContext/ThemeContext";

export const createAppTheme = (
  mode: ThemeMode,
) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#4600be" : "#210083",
        light: mode === "light" ? "#A78BFA" : "#C4B5FD",
        dark: mode === "light" ? "#6D28D9" : "#8B5CF6",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: mode === "light" ? "#64748B" : "#94A3B8",
        contrastText: mode === "light" ? "#FFFFFF" : "#0F172A",
      },
      background: {
        default: mode === "light" ? "#F8FAFC" : "#0B1120",
        paper: mode === "light" ? "#FFFFFF" : "#111827",
      },
      text: {
        primary: mode === "light" ? "#0F172A" : "#F1F5F9",
        secondary: mode === "light" ? "#64748B" : "#94A3B8",
        disabled: mode === "light" ? "#94A3B8" : "#64748B",
      },
      divider: mode === "light" ? "#E2E8F0" : "#1E293B",
      success: {
        main: "#10B981",
        contrastText: "#FFFFFF",
      },
      warning: {
        main: "#F59E0B",
        contrastText: "#FFFFFF",
      },
      error: {
        main: "#EF4444",
        contrastText: "#FFFFFF",
      },
      info: {
        main: mode === "light" ? "#7C3AED" : "#A78BFA",
      },
      action: {
        hover:
          mode === "light"
            ? "rgba(124, 58, 237, 0.08)"
            : "rgba(167, 139, 250, 0.12)",
        selected:
          mode === "light"
            ? "rgba(124, 58, 237, 0.12)"
            : "rgba(167, 139, 250, 0.16)",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor:
              mode === "light" ? "#CBD5E1 #F1F5F9" : "#334155 #0B1120",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: mode === "light" ? "#CBD5E1" : "#334155",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${mode === "light" ? "#E2E8F0" : "#1E293B"
              }`,
            boxShadow:
              mode === "light"
                ? "0 1px 3px 0 rgb(0 0 0 / 0.05)"
                : "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
          containedPrimary: {
            "&:hover": {
              backgroundColor: mode === "light" ? "#6D28D9" : "#8B5CF6",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: mode === "light" ? "#FFFFFF" : "#111827",
            color: mode === "light" ? "#0F172A" : "#F1F5F9",
            borderBottom: `1px solid ${mode === "light" ? "#E2E8F0" : "#1E293B"
              }`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            borderRight: `1px solid ${mode === "light" ? "#E2E8F0" : "#1E293B"
              }`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === "light" ? "#E2E8F0" : "#1E293B"
              }`,
          },
        },
      },
    },
  } as ThemeOptions);
