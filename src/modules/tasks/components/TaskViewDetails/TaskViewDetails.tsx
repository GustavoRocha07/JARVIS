import {
  Box,
  Checkbox,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { TaskFocusInsights } from "@/modules/timer/components/TaskFocusInsights/TaskFocusInsights";
import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "../../types/tasks.type";

type TaskViewDetailsProps = {
  task: Task;
  onSubTaskComplete: (subTask: SubTask, completed: boolean) => void;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR").format(date);

export const TaskViewDetails = ({
  task,
  onSubTaskComplete,
}: TaskViewDetailsProps) => (
  <Stack spacing={2.5}>
    <Box>
      <Typography variant="caption" color="text.secondary">
        Título
      </Typography>
      <Typography variant="h6">{task.title}</Typography>
    </Box>

    <Box>
      <Typography variant="caption" color="text.secondary">
        Descrição
      </Typography>
      <Typography variant="body1">
        {task.description || "Sem descrição"}
      </Typography>
    </Box>

    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Status
        </Typography>
        <Typography variant="body2">{task.status}</Typography>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Prioridade
        </Typography>
        <Typography variant="body2">{task.priority}</Typography>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Vencimento
        </Typography>
        <Typography variant="body2">{formatDate(task.dueDate)}</Typography>
      </Box>
    </Stack>

    <Divider />

    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Subtarefas
      </Typography>

      {task.subTasks?.length ? (
        <Stack spacing={0.75}>
          {task.subTasks.map((subTask) => {
            const completed = subTask.status === "COMPLETED";

            return (
              <Box
                key={subTask.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1,
                  py: 0.75,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                }}
              >
                <Checkbox
                  size="small"
                  checked={completed}
                  onChange={(event) =>
                    onSubTaskComplete(subTask, event.target.checked)
                  }
                  icon={<RadioButtonUncheckedIcon fontSize="small" />}
                  checkedIcon={<CheckCircleIcon fontSize="small" />}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textDecoration: completed ? "line-through" : "none",
                      opacity: completed ? 0.65 : 1,
                    }}
                  >
                    {subTask.title}
                  </Typography>

                  {subTask.description && (
                    <Typography variant="caption" color="text.secondary">
                      {subTask.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Nenhuma subtarefa cadastrada.
        </Typography>
      )}
    </Box>

    <Divider />

    <TaskFocusInsights task={task} />
  </Stack>
);
