import { useMemo } from "react";

import {
  AccessTimeOutlined,
  HistoryOutlined,
  LocalFireDepartmentOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { Task } from "@/modules/tasks/types/tasks.type";

import { handleListTimerSessionsService } from "../../services/timer-session.service";
import {
  getSubTaskCompletedFocusCount,
  getSubTaskWorkedSeconds,
  getTaskCompletedFocusCount,
  getTaskDirectCompletedFocusCount,
  getTaskDirectWorkedSeconds,
  getTaskSessions,
  getTaskTotalWorkedSeconds,
} from "../../selectors/timer-session.selectors";
import { formatWorkedDuration } from "../../utils/formatWorkedDuration";
import type { TimerSession } from "../../types/timer-session.type";

type TaskFocusInsightsProps = {
  task: Task;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

const getSessionActivityLabel = (session: TimerSession, task: Task) => {
  if (session.target.type === "TASK") {
    return task.title;
  }

  return (
    task.subTasks?.find(
      (subTask) => subTask.id === session.target.subTaskId,
    )?.title ?? "Subtarefa removida"
  );
};

export const TaskFocusInsights = ({ task }: TaskFocusInsightsProps) => {
  const sessions = useMemo(
    () => handleListTimerSessionsService(),
    [task.id],
  );

  const taskSessions = useMemo(
    () => getTaskSessions(task.id, sessions),
    [sessions, task.id],
  );

  const directWorkedSeconds = getTaskDirectWorkedSeconds(task.id, sessions);
  const totalWorkedSeconds = getTaskTotalWorkedSeconds(task.id, sessions);
  const directTomatoes = getTaskDirectCompletedFocusCount(task.id, sessions);
  const totalTomatoes = getTaskCompletedFocusCount(task.id, sessions);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Foco e tempo investido
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Métricas calculadas a partir das sessões registradas.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Paper variant="outlined" sx={{ flex: 1, p: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <AccessTimeOutlined color="primary" fontSize="small" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Tempo total
              </Typography>
              <Typography variant="h6">
                {formatWorkedDuration(totalWorkedSeconds)}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ flex: 1, p: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <LocalFireDepartmentOutlined color="warning" fontSize="small" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Tomatoes concluídos
              </Typography>
              <Typography variant="h6">{totalTomatoes}</Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ flex: 1, p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Direto na Task
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {formatWorkedDuration(directWorkedSeconds)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {directTomatoes} Tomato{directTomatoes === 1 ? "" : "s"}
          </Typography>
        </Paper>
      </Stack>

      {task.subTasks?.length ? (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Tempo por subtarefa
          </Typography>

          <Stack spacing={0.75}>
            {task.subTasks.map((subTask) => {
              const workedSeconds = getSubTaskWorkedSeconds(
                task.id,
                subTask.id,
                sessions,
              );
              const tomatoes = getSubTaskCompletedFocusCount(
                task.id,
                subTask.id,
                sessions,
              );

              return (
                <Paper
                  key={subTask.id}
                  variant="outlined"
                  sx={{ px: 1.25, py: 1 }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {subTask.title}
                    </Typography>
                    <Stack direction="row" spacing={0.75}>
                      <Chip
                        size="small"
                        label={formatWorkedDuration(workedSeconds)}
                        icon={<AccessTimeOutlined />}
                      />
                      <Chip
                        size="small"
                        label={`${tomatoes} 🍅`}
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Box>
      ) : null}

      <Divider />

      <Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", mb: 1 }}
        >
          <HistoryOutlined fontSize="small" />
          <Typography variant="subtitle2">Histórico de foco</Typography>
        </Stack>

        {taskSessions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhuma sessão de foco registrada.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {taskSessions.map((session) => {
              const isSubTask = session.target.type === "SUBTASK";

              return (
                <Paper key={session.id} variant="outlined" sx={{ p: 1.25 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {getSessionActivityLabel(session, task)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dateFormatter.format(session.startedAt)} · {timeFormatter.format(session.startedAt)} → {timeFormatter.format(session.finishedAt)}
                      </Typography>
                      {isSubTask && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          Subtarefa de: {task.title}
                        </Typography>
                      )}
                    </Box>

                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ alignItems: "center" }}
                    >
                      <Chip
                        size="small"
                        label={formatWorkedDuration(session.workedSeconds)}
                      />
                      <Chip
                        size="small"
                        color={session.completedFocus ? "success" : "default"}
                        variant={session.completedFocus ? "filled" : "outlined"}
                        label={
                          session.completedFocus
                            ? "🍅 Ciclo completo"
                            : "Sessão parcial"
                        }
                      />
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};
