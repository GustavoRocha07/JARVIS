import {
  createTheme,
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
        main:
          mode === "light"
            ? "#1E3A8A"
            : "#8B5CF6",
      },
      secondary: {
        main:
          mode === "light"
            ? "#64748B"
            : "#94A3B8",
      },
      background: {
        default:
          mode === "light"
            ? "#F8FAFC"
            : "#0B1120",
        paper:
          mode === "light"
            ? "#FFFFFF"
            : "#111827",
      },
      text: {
        primary:
          mode === "light"
            ? "#0F172A"
            : "#F8FAFC",
        secondary:
          mode === "light"
            ? "#475569"
            : "#94A3B8",
      },
      divider:
        mode === "light"
          ? "#E2E8F0"
          : "#1F2937",
    },
    typography: {
      fontFamily:
        "Roboto, Arial, sans-serif",
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
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
    },
  });
