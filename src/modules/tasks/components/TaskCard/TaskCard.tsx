import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "../../types/tasks.type";

import {
  priorityLabels,
  statusStyles,
} from "@/shared/utils/getColorsAlert";
import { TimerOutlined, RemoveRedEye, DeleteForeverOutlined } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import { useTimer } from "@/modules/timer/contexts/useTimer";
import { formatTimer } from "@/modules/timer/utils/formatTimer";
import { ActionsMenu } from "@/shared/components/ActionsMenu/ActionsMenu";


type TaskCardProps = {
  task: Task;
  onClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task, completed: boolean) => void;
  onOpenTimer: (target: Task | SubTask) => void;
  onSubTaskComplete?: (subTask: SubTask, completed: boolean) => void;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR").format(date);

const isSubTaskCompleted = (subTask: SubTask) =>
  subTask.status === "COMPLETED";

export const TaskCard = ({
  task,
  onClick,
  onEdit,
  onDelete,
  onComplete,
  onOpenTimer,
  onSubTaskComplete,
}: TaskCardProps) => {
  const subtasks = task.subTasks ?? [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(isSubTaskCompleted).length;

  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const { timer, isTimerOwner } = useTimer();
  const isCompleted = task.status === "COMPLETED";
  const ownsTaskTimer = isTimerOwner({
    type: "TASK",
    taskId: task.id,
  });

  const handleCompleteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.stopPropagation();
    onComplete(task, event.target.checked);
  };

  const handleSubTaskChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    subTask: SubTask,
  ) => {
    event.stopPropagation();
    onSubTaskComplete?.(subTask, event.target.checked);
  };

  const timerStatusLabel = timer.status === "PAUSED"
    ? "Pausado"
    : timer.status === "WAITING_BREAK"
      ? "Foco concluído"
      : timer.status === "FINISHED"
        ? "Finalizado"
        : timer.phase === "BREAK"
          ? "Em pausa"
          : "Em foco";

  return (
    <Card
      onClick={() => onClick(task)}
      sx={{
        mb: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "none",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Checkbox
            size="small"
            checked={isCompleted}
            onChange={handleCompleteChange}
            onClick={(event) => event.stopPropagation()}
            icon={<RadioButtonUncheckedIcon fontSize="small" />}
            checkedIcon={<CheckCircleIcon fontSize="small" />}
            sx={{ p: 0.25, mt: 0.1 }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ minWidth: 0, alignItems: "center" }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  minWidth: 0,
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textDecoration: isCompleted ? "line-through" : "none",
                  opacity: isCompleted ? 0.65 : 1,
                }}
              >
                {task.title}
              </Typography>

              <Chip
                size="small"
                label={priorityLabels[task.priority]}
                sx={{
                  ...statusStyles[task.status],
                  height: 20,
                  fontSize: 11,
                }}
              />
            </Stack>

            {ownsTaskTimer && (
              <Typography
                variant="body2"
                color={timer.status === "FINISHED" ? "success.main" : "primary.main"}
                sx={{ mt: 0.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
              >
                {formatTimer(timer.remainingSeconds)} · {timerStatusLabel}
              </Typography>
            )}

            {task.description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.35,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {task.description}
              </Typography>
            )}

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ mt: 0.65, color: "text.secondary", alignItems: "center" }}
            >
              <CalendarTodayOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption">
                {formatDate(task.dueDate)}
              </Typography>
            </Stack>
          </Box>

          {totalSubtasks > 0 && (
            <Box sx={{ width: 72, pt: 0.2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", mb: 0.5 }}
              >
                {completedSubtasks}/{totalSubtasks}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 3, borderRadius: 99 }}
              />
            </Box>
          )}

          <ActionsMenu
            actions={[
              {
                label: 'Abrir timer',
                onClick: () => onOpenTimer(task),
                icon: <TimerOutlined />
              },
              {
                label: 'Editar Tarefa',
                onClick: () => onEdit(task),
                icon: <EditIcon />
              },
              {
                label: 'Visualizar Tarefa',
                onClick: () => onClick(task),
                icon: <RemoveRedEye />
              },
              {
                label: 'Deletar Tarefa',
                onClick: () => onDelete(task),
                icon: <DeleteForeverOutlined />
              },
            ]}
          />
        </Box>

        {subtasks.length > 0 && (
          <Stack spacing={0.35} sx={{ mt: 1.1, ml: 3.7 }}>
            {subtasks.map((subTask) => {
              const completed = isSubTaskCompleted(subTask);
              const ownsSubTaskTimer = isTimerOwner({
                type: "SUBTASK",
                taskId: subTask.taskId,
                subTaskId: subTask.id,
              });

              return (
                <Box
                  key={subTask.id}
                  onClick={(event) => event.stopPropagation()}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 40,
                    marginY: '1rem',
                    px: 0.75,
                    borderRadius: 1.25,
                    backgroundColor: "action.hover",
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={completed}
                    disabled={!onSubTaskComplete}
                    onChange={(event) =>
                      handleSubTaskChange(event, subTask)
                    }
                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                    checkedIcon={<CheckCircleIcon fontSize="small" />}
                    sx={{ p: 0.3, mr: 0.6 }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textDecoration: completed ? "line-through" : "none",
                      opacity: completed ? 0.65 : 1,
                    }}
                  >
                    {subTask.title}
                  </Typography>

                  {ownsSubTaskTimer && (
                    <Typography
                      variant="caption"
                      color={timer.status === "FINISHED" ? "success.main" : "primary.main"}
                      sx={{ mr: 1, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatTimer(timer.remainingSeconds)}
                    </Typography>
                  )}

                  <ActionsMenu
                    ariaLabel="Ações da subtarefa"
                    actions={[
                      {
                        label: "Abrir timer",
                        onClick: () => onOpenTimer(subTask),
                        icon: <TimerOutlined />,
                      },
                    ]}
                  />
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
