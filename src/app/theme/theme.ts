import {
  createTheme,
  type ThemeOptions,
} from "@mui/material/styles";

import type {
  ThemeMode,
} from "@/context/ThemeContext/ThemeContext";

export const createAppTheme = (mode: ThemeMode) => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: isLight ? "#1976D2" : "#64B5F6",
        light: isLight ? "#64B5F6" : "#90CAF9",
        dark: isLight ? "#1565C0" : "#42A5F5",
        contrastText: isLight ? "#FFFFFF" : "#0B1120",
      },

      button: {
        main: isLight ? "#1976D2" : "#64B5F6",
      },

      secondary: {
        main: isLight ? "#546E7A" : "#90A4AE",
        contrastText: isLight ? "#FFFFFF" : "#0F172A",
      },

      background: {
        default: isLight ? "#F5F9FF" : "#0B1120",
        paper: isLight ? "#FFFFFF" : "#111827",
      },

      text: {
        primary: isLight ? "#0F172A" : "#F1F5F9",
        secondary: isLight ? "#64748B" : "#94A3B8",
        disabled: isLight ? "#94A3B8" : "#64748B",
      },

      divider: isLight ? "#DCE7F3" : "#1E3450",

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
        main: isLight ? "#0288D1" : "#4FC3F7",
      },

      action: {
        hover: isLight
          ? "rgba(25, 118, 210, 0.08)"
          : "rgba(100, 181, 246, 0.12)",

        selected: isLight
          ? "rgba(25, 118, 210, 0.12)"
          : "rgba(100, 181, 246, 0.16)",
      },
    },

    typography: {
      fontFamily:
        '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

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
            scrollbarColor: isLight
              ? "#B0C4DE #F5F9FF"
              : "#334D6E #0B1120",

            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },

            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: isLight
                ? "#B0C4DE"
                : "#334D6E",
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${isLight ? "#DCE7F3" : "#1E3450"
              }`,
            boxShadow: isLight
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
              backgroundColor: isLight
                ? "#1565C0"
                : "#42A5F5",
            },
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: isLight
              ? "#FFFFFF"
              : "#111827",
            color: isLight ? "#0F172A" : "#F1F5F9",
            borderBottom: `1px solid ${isLight ? "#DCE7F3" : "#1E3450"
              }`,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            borderRight: `1px solid ${isLight ? "#DCE7F3" : "#1E3450"
              }`,
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isLight ? "#DCE7F3" : "#1E3450"
              }`,
          },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: isLight
              ? "#E3F2FD"
              : "#16345C",
          },

          bar: {
            borderRadius: 4,
          },
        },
      },
    },
  } as ThemeOptions);
};