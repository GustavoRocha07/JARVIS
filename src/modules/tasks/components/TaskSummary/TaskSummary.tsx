import {
  AutorenewOutlined,
  CheckCircleOutlined,
  ListAltOutlined,
  RadioButtonUnchecked,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

import { useTaskSummary } from "../../hooks/useTaskSummary";
import { CardComponent } from "@/shared/components/CardComponent/Card";

export const TaskSummary = () => {
  const summary = useTaskSummary();

  const cards = [
    {
      label: "Total de tarefas",
      value: summary.total,
      icon: <ListAltOutlined sx={{ fontSize: 19 }} />,
      color: "#0284c7",
      backgroundColor: "#e0f2fe",
    },
    {
      label: "Pendentes",
      value: summary.pending,
      icon: <RadioButtonUnchecked sx={{ fontSize: 18 }} />,
      color: "#64748b",
      backgroundColor: "#f1f5f9",
    },
    {
      label: "Em andamento",
      value: summary.inProgress,
      icon: <AutorenewOutlined sx={{ fontSize: 19 }} />,
      color: "#0284c7",
      backgroundColor: "#e0f2fe",
    },
    {
      label: "Concluídas",
      value: summary.completed,
      icon: <CheckCircleOutlined sx={{ fontSize: 19 }} />,
      color: "#059669",
      backgroundColor: "#dcfce7",
    },
    {
      label: "Atrasadas",
      value: summary.overdue,
      icon: <WarningAmberOutlined sx={{ fontSize: 19 }} />,
      color: "#ef4444",
      backgroundColor: "#fee2e2",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(5, minmax(0, 1fr))",
        },
        gap: 1.25,
      }}
    >
      {cards.map((card) => (
        <CardComponent>
          <Box
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: "10px",
              color: card.color,
              backgroundColor: card.backgroundColor,
            }}
          >
            {card.icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={(theme) => ({

                fontSize: 20,
                lineHeight: 1,
                fontWeight: 800,
                color: theme.palette.text.primary,

              })}
            >
              {card.value}
            </Typography>
            <Typography
              sx={(theme) => ({
                mt: 0.35,
                fontSize: 12,
                lineHeight: 1.2,
                color: card.color ?? theme.palette.text.secondary,
                whiteSpace: "nowrap",
              })}
            >
              {card.label}
            </Typography>
          </Box>
        </CardComponent>
      ))
      }
    </Box >
  );
};
