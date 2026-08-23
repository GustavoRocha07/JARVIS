import type { ReactNode } from "react";

import {
  DashboardOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  LogoutOutlined,
  TaskOutlined,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";

import Logo from "@/assets/logo.svg";
import { useThemeMode } from "@/context/ThemeContext/useThemeMode";

import { NavLink, Outlet } from "react-router-dom";

const SIDEBAR_WIDTH = 260;

type MenuItem = {
  label: string;
  path: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    label: "Tarefas",
    path: "/tasks",
    icon: <TaskOutlined />,
  },
];

export const AppLayout = () => {
  const {
    isDarkMode,
    toggleTheme,
  } = useThemeMode();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        component="aside"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          width: SIDEBAR_WIDTH,
          minWidth: SIDEBAR_WIDTH,
          height: "100vh",
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Box sx={{ px: 3, py: 3 }}>
          <img src={Logo} width="200" alt="Jarvis" />
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)" }} />

        <List sx={{ flex: 1, px: 1.5, py: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                position: "relative",
                minHeight: 48,
                mb: 0.5,
                borderRadius: 2,
                color: "rgba(255, 255, 255, 0.8)",
                "& .MuiListItemIcon-root": { color: "inherit" },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                },
                "&.active": {
                  backgroundColor: "rgba(255, 255, 255, 0.14)",
                  color: "#FFFFFF",
                  "&::before": {
                    content: "\"\"",
                    position: "absolute",
                    top: 8,
                    bottom: 8,
                    left: 0,
                    width: 3,
                    borderRadius: "0 4px 4px 0",
                    backgroundColor: "#8B7CFF",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "inherit",
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)" }} />

        <Box sx={{ px: 1.5, pt: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minHeight: 48,
              px: 1.5,
              borderRadius: 2,
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 40,
              }}
            >
              {isDarkMode ? <DarkModeOutlined /> : <LightModeOutlined />}
            </Box>

            <Typography
              sx={{
                flex: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              {isDarkMode ? "Modo escuro" : "Modo claro"}
            </Typography>

            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              slotProps={{
                input: {
                  "aria-label": "Alternar entre tema claro e escuro",
                },
              }}
              sx={{
                "& .MuiSwitch-switchBase": { color: "#FFFFFF" },
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#FFFFFF" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "rgba(255, 255, 255, 0.35)",
                },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ p: 1.5 }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              borderRadius: 2,
              color: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#FFFFFF",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <LogoutOutlined />
            </ListItemIcon>

            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "inherit",
                  }}
                >
                  Sair
                </Typography>
              }
            />
          </ListItemButton>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          minHeight: "100vh",
          ml: `${SIDEBAR_WIDTH}px`,
        }}
      >
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: 64,
            px: 3,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Gustavo Dias
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
