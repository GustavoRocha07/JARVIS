import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "../../types/tasks.type";

import {
  priorityLabels,
  statusStyles,
} from "@/shared/utils/getColorsAlert";


type TaskCardProps = {
  task: Task;
  onClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task, completed: boolean) => void;
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
  onComplete,
  onSubTaskComplete,
}: TaskCardProps) => {
  const subtasks = task.subTasks ?? [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(isSubTaskCompleted).length;

  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const isCompleted = task.status === "COMPLETED";

  const handleCompleteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.stopPropagation();
    onComplete(task, event.target.checked);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    onEdit(task);
  };

  const handleSubTaskChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    subTask: SubTask,
  ) => {
    event.stopPropagation();
    onSubTaskComplete?.(subTask, event.target.checked);
  };

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

          <IconButton
            size="small"
            aria-label="Ações da tarefa"
            title="Editar tarefa"
            onClick={handleMenuClick}
            sx={{ mt: -0.35 }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>

        {subtasks.length > 0 && (
          <Stack spacing={0.35} sx={{ mt: 1.1, ml: 3.7 }}>
            {subtasks.map((subTask) => {
              const completed = isSubTaskCompleted(subTask);

              return (
                <Box
                  key={subTask.id}
                  onClick={(event) => event.stopPropagation()}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 34,
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

                  <IconButton
                    size="small"
                    aria-label="Ações da subtarefa"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <MoreHorizIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
