import {
  AccessTimeOutlined,
  BarChartOutlined,
  CalendarTodayOutlined,
  CheckCircle,
  CheckCircleOutline,
  DeleteForeverOutlined,
  ListAltOutlined,
  PlayArrowOutlined,
  RadioButtonUnchecked,
  RemoveRedEye,
  TimerOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "../../types/tasks.type";

import { formatTimer } from "@/modules/timer/utils/formatTimer";
import { ActionsMenu } from "@/shared/components/ActionsMenu/ActionsMenu";
import { formatDate } from "@/shared/utils/date.utils";
import { useTaskCard } from "../../hooks/useTaskCard";

type TaskCardProps = {
  task: Task;
  onClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task, completed: boolean) => void;
  onOpenTimer: (target: Task | SubTask) => void;
  onSubTaskComplete?: (subTask: SubTask, completed: boolean) => void;
};

const statusMeta: Record<
  Task["status"],
  { label: string; backgroundColor: string; color: string }
> = {
  PENDING: {
    label: "Pending",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
  },
  IN_PROGRESS: {
    label: "In Progress",
    backgroundColor: "#dff3ff",
    color: "#0284c7",
  },
  COMPLETED: {
    label: "Completed",
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  CANCELLED: {
    label: "Cancelled",
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
  },
};

const priorityMeta: Record<
  Task["priority"],
  { label: string; backgroundColor: string; color: string }
> = {
  LOW: {
    label: "Low",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
  },
  MEDIUM: {
    label: "Medium",
    backgroundColor: "#fff3d6",
    color: "#d97706",
  },
  HIGH: {
    label: "High",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },
  URGENT: {
    label: "Urgent",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
};

const chipSx = {
  height: 28,
  borderRadius: "9px",
  fontSize: 12,
  fontWeight: 500,
  "& .MuiChip-label": { px: 1 },
  "& .MuiChip-icon": { ml: 0.7, mr: -0.3 },
};

export const TaskCard = ({
  task,
  onClick,
  onEdit,
  onDelete,
  onComplete,
  onOpenTimer,
  onSubTaskComplete,
}: TaskCardProps) => {
  const { state, actions, selectors } = useTaskCard({
    task,
    onComplete,
    onSubTaskComplete,
  });

  const status = statusMeta[task.status];
  const priority = priorityMeta[task.priority];
  const progressColor = state.isCompleted ? "#059669" : "#0284c7";

  return (
    <Card
      onClick={() => onClick(task)}
      sx={{
        height: "100%",
        minHeight: 300,
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
        backgroundColor: "#fff",
        cursor: "pointer",
        overflow: "hidden",
        opacity: state.isCancelled ? 0.72 : 1,
        transition: "box-shadow 160ms ease, transform 160ms ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          "&:last-child": { pb: 1.6 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                color: state.isCancelled ? "#64748b" : "#0f172a",
                lineHeight: 1.35,
                textDecoration: state.isCompleted ? "line-through" : "none",
              }}
            >
              {task.title}
            </Typography>

            <Typography
              sx={{
                mt: 0.7,
                minHeight: 38,
                fontSize: 12.5,
                lineHeight: 1.55,
                color: state.isCancelled ? "#94a3b8" : "#64748b",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.description}
            </Typography>
          </Box>

          <Box onClick={(event) => event.stopPropagation()}>
            <ActionsMenu
              actions={[
                {
                  label: state.isCompleted
                    ? "Reabrir tarefa"
                    : "Marcar como concluída",
                  onClick: () => actions.completeTask(!state.isCompleted),
                  icon: state.isCompleted ? (
                    <RadioButtonUnchecked />
                  ) : (
                    <CheckCircleOutline />
                  ),
                },
                {
                  label: "Abrir timer",
                  onClick: () => onOpenTimer(task),
                  icon: <TimerOutlined />,
                },
                {
                  label: "Editar Tarefa",
                  onClick: () => onEdit(task),
                  icon: <EditIcon />,
                },
                {
                  label: "Visualizar Tarefa",
                  onClick: () => onClick(task),
                  icon: <RemoveRedEye />,
                },
                {
                  label: "Deletar Tarefa",
                  onClick: () => onDelete(task),
                  icon: <DeleteForeverOutlined />,
                },
              ]}
            />
          </Box>
        </Box>

        <Stack
          direction="row"
          useFlexGap
          flexWrap="wrap"
          spacing={0.75}
          sx={{ mt: 1.45 }}
        >
          <Chip
            size="small"
            label={status.label}
            icon={
              state.isCompleted ? (
                <CheckCircle sx={{ fontSize: 11 }} />
              ) : (
                <RadioButtonUnchecked sx={{ fontSize: 10 }} />
              )
            }
            sx={{
              ...chipSx,
              backgroundColor: status.backgroundColor,
              color: status.color,
              "& .MuiChip-icon": { color: status.color },
            }}
          />

          <Chip
            size="small"
            label={priority.label}
            icon={<BarChartOutlined sx={{ fontSize: 14 }} />}
            sx={{
              ...chipSx,
              backgroundColor: priority.backgroundColor,
              color: priority.color,
              "& .MuiChip-icon": { color: priority.color },
            }}
          />

          <Chip
            size="small"
            label={formatDate(task.dueDate)}
            icon={<CalendarTodayOutlined sx={{ fontSize: 13 }} />}
            sx={{
              ...chipSx,
              backgroundColor: "#f8fafc",
              color: "#64748b",
              border: "1px solid #e2e8f0",
              "& .MuiChip-icon": { color: "#64748b" },
            }}
          />
        </Stack>

        {state.isOverdue && (
          <Box sx={{ mt: 0.75 }}>
            <Chip
              size="small"
              label={`Atrasada · ${formatDate(task.dueDate)}`}
              icon={<WarningAmberOutlined sx={{ fontSize: 14 }} />}
              sx={{
                ...chipSx,
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                "& .MuiChip-icon": { color: "#dc2626" },
              }}
            />
          </Box>
        )}

        {state.totalSubtasks > 0 && (
          <Box sx={{ mt: 1.5 }}>
            <Box
              sx={{
                mb: 0.7,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={0.6} alignItems="center">
                <ListAltOutlined sx={{ fontSize: 14, color: "#64748b" }} />
                <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>
                  {state.completedSubtasks} de {state.totalSubtasks} concluídas
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#0f172a",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(state.progress)}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={state.progress}
              sx={{
                height: 4,
                borderRadius: 99,
                backgroundColor: "#e8edf3",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 99,
                  backgroundColor: progressColor,
                },
              }}
            />
          </Box>
        )}

        {state.subtasks.length > 0 && (
          <Stack spacing={0.15} sx={{ mt: 0.9 }}>
            {state.subtasks.slice(0, 3).map((subTask) => {
              const completed = selectors.isSubTaskCompleted(subTask);
              const ownsSubTaskTimer = selectors.isTimerOwner({
                type: "SUBTASK",
                taskId: subTask.taskId,
                subTaskId: subTask.id,
              });

              return (
                <Box
                  key={subTask.id}
                  onClick={(event) => event.stopPropagation()}
                  sx={{
                    minHeight: 29,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={completed}
                    disabled={!onSubTaskComplete}
                    onChange={(event) =>
                      actions.completeSubTask(subTask, event.target.checked)
                    }
                    icon={<RadioButtonUnchecked sx={{ fontSize: 16 }} />}
                    checkedIcon={<CheckCircle sx={{ fontSize: 16 }} />}
                    sx={{
                      p: 0.2,
                      mr: 0.7,
                      color: "#0284c7",
                      "&.Mui-checked": { color: "#0284c7" },
                    }}
                  />

                  <Typography
                    sx={{
                      minWidth: 0,
                      flex: 1,
                      fontSize: 12.5,
                      color: completed ? "#64748b" : "#0f172a",
                      textDecoration: completed ? "line-through" : "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {subTask.title}
                  </Typography>

                  {ownsSubTaskTimer && (
                    <Typography
                      sx={{
                        ml: 1,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#0284c7",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatTimer(state.timer.remainingSeconds)}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}

        <Box sx={{ flexGrow: 1, minHeight: 10 }} />

        <Divider sx={{ mt: 1.25, mb: 1.15, borderColor: "#e8edf3" }} />

        <Stack
          direction="row"
          spacing={0.75}
          alignItems="center"
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            size="small"
            startIcon={<AccessTimeOutlined sx={{ fontSize: 15 }} />}
            onClick={() => onOpenTimer(task)}
            sx={{
              minWidth: 0,
              px: 1,
              height: 30,
              borderRadius: "9px",
              textTransform: "none",
              fontSize: 11.5,
              fontWeight: 600,
              color: "#ef5b3f",
              backgroundColor: "#fff0eb",
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "#ffe6de" },
            }}
          >
            {state.ownsTaskTimer
              ? `Pomodoro ${formatTimer(state.timer.remainingSeconds)}`
              : "Pomodoro 25 min"}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<PlayArrowOutlined sx={{ fontSize: 15 }} />}
            disabled={state.isCompleted || state.isCancelled}
            onClick={() => onOpenTimer(task)}
            sx={{
              minWidth: 0,
              px: 1,
              height: 30,
              borderRadius: "9px",
              textTransform: "none",
              fontSize: 11.5,
              color: "#64748b",
              borderColor: "#dce2e8",
            }}
          >
            Focar
          </Button>

          <Box sx={{ flex: 1 }} />

          <Button
            size="small"
            onClick={() => onClick(task)}
            sx={{
              minWidth: 0,
              px: 0.4,
              height: 30,
              textTransform: "none",
              fontSize: 11.5,
              color: "#64748b",
            }}
          >
            Detalhes
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
