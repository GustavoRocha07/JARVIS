import {
  AutorenewOutlined,
  CheckCircleOutlined,
  ListAltOutlined,
  RadioButtonUnchecked,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";

import { useTaskSummary } from "../../hooks/useTaskSummary";

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
        <Paper
          key={card.label}
          elevation={0}
          sx={{
            minHeight: 62,
            px: 1.6,
            py: 1.25,
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            backgroundColor: "#fff",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
          }}
        >
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
              sx={{
                fontSize: 20,
                lineHeight: 1,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {card.value}
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
                fontSize: 12,
                lineHeight: 1.2,
                color: "#64748b",
                whiteSpace: "nowrap",
              }}
            >
              {card.label}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};
