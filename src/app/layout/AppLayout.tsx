import type { ReactNode } from 'react';

import {
  DashboardOutlined,
  LogoutOutlined,
  TaskOutlined
} from '@mui/icons-material';

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import Logo from '@/assets/logo.svg'

import { NavLink, Outlet } from 'react-router-dom';

const SIDEBAR_WIDTH = 260;

type MenuItem = {
  label: string;
  path: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardOutlined />,
  },
  {
    label: 'Tarefas',
    path: '/tasks',
    icon: <  TaskOutlined />,
  },

];

export const AppLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F7F8FC',
      }}
    >
      {/* SIDEBAR */}
      <Box
        component="aside"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          width: SIDEBAR_WIDTH,
          minWidth: SIDEBAR_WIDTH,
          height: '100vh',
          backgroundColor: '#170078',
          color: '#FFFFFF',
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            px: 3,
            py: 3,
          }}
        >
          <img src={Logo} width={'200px'}/>
        </Box>

        <Divider
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.12)',
          }}
        />

        {/* MENU */}
        <List
          sx={{
            flex: 1,
            px: 1.5,
            py: 2,
          }}
        >
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                position: 'relative',
                minHeight: 48,
                mb: 0.5,
                borderRadius: 2,
                color: 'rgba(255, 255, 255, 0.8)',

                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                },

                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                },

                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  color: '#FFFFFF',

                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 8,
                    bottom: 8,
                    left: 0,
                    width: 3,
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: '#8B7CFF',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      lineHeight: 1.5,
                      color: 'inherit',
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>

        {/* LOGOUT */}
        <Divider
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.12)',
          }}
        />

        <Box
          sx={{
            p: 1.5,
          }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              borderRadius: 2,
              color: 'rgba(255, 255, 255, 0.8)',

              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: 'inherit',
              }}
            >
              <LogoutOutlined />
            </ListItemIcon>

            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: 'inherit',
                  }}
                >
                  Sair
                </Typography>
              }
            />
          </ListItemButton>
        </Box>
      </Box>

      {/* CONTEÚDO DA APLICAÇÃO */}
      <Box
        component="main"
        sx={{
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          minHeight: '100vh',
          ml: `${SIDEBAR_WIDTH}px`,
        }}
      >
        {/* HEADER */}
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: 64,
            px: 3,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E8EAF0',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              lineHeight: 1.5,
              color: '#1A1D29',
            }}
          >
            Gustavo Dias
          </Typography>
        </Box>

        {/* CONTEÚDO DAS ROTAS */}
        <Box
          sx={{
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};