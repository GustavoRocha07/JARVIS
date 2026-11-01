import {
  CoffeeOutlined,
  Pause,
  PlayArrow,
  RestartAlt,
  Stop,
} from "@mui/icons-material";
import { Divider, Stack, Typography } from "@mui/material";

import { useTimer } from "@/modules/timer/contexts/useTimer";
import { FOCUS_DURATION_SECONDS } from "@/modules/timer/constants/timer.constants";
import { formatTimer } from "@/modules/timer/utils/formatTimer";
import type { Task } from "@/modules/tasks/types/tasks.type";
import { ButtonComponent } from "@/shared/components/ButtonComponent";

type ProjectFocusTimerProps = {
  task?: Task;
  onStart: (task: Task) => void;
};

type TimerState = ReturnType<typeof useTimer>["timer"];

const getTimerTitle = (
  task: Task | undefined,
  target: TimerState["target"],
): string => {
  if (!target) {
    return task?.title ?? "Selecione uma tarefa para focar";
  }

  if (target.type === "SUBTASK") {
    const subTask = task?.subTasks?.find(
      (item) => item.id === target.subTaskId,
    );

    return subTask?.title ?? "Sessão de foco ativa";
  }

  return task?.title ?? "Sessão de foco ativa";
};

const getTimerStatusLabel = (timer: TimerState): string => {
  if (timer.status === "FINISHED") {
    return "Sessão finalizada";
  }

  if (timer.status === "WAITING_BREAK") {
    return "Foco concluído";
  }

  const phaseLabel = timer.phase === "BREAK" ? "Pausa" : "Foco";

  return timer.status === "PAUSED"
    ? `${phaseLabel} em pausa`
    : phaseLabel;
};

export const ProjectFocusTimer = ({
  task,
  onStart,
}: ProjectFocusTimerProps) => {
  const {
    timer,
    pauseTimer,
    resumeTimer,
    restartTimer,
    startBreak,
    skipBreak,
    finishTimer,
    resetTimer,
  } = useTimer();

  const isActive = timer.target !== null;
  const isFinished = timer.status === "FINISHED";
  const isBreak = timer.phase === "BREAK";

  const canStart =
    task !== undefined &&
    task.status !== "COMPLETED" &&
    task.status !== "CANCELLED";

  const title = getTimerTitle(task, timer.target);
  const statusLabel = getTimerStatusLabel(timer);

  const remainingSeconds = isActive
    ? timer.remainingSeconds
    : FOCUS_DURATION_SECONDS;

  const showSecondaryActions = isActive && !isFinished;

  const handleStart = () => {
    if (!task || !canStart) return;

    onStart(task);
  };

  const renderPrimaryAction = () => {
    if (!isActive) {
      return (
        <ButtonComponent
          text="Iniciar foco"
          variant="contained"
          startIcon={<PlayArrow />}
          disabled={!canStart}
          onClick={handleStart}
        />
      );
    }

    switch (timer.status) {
      case "RUNNING":
        return (
          <ButtonComponent
            text="Pausar"
            variant="contained"
            startIcon={<Pause />}
            onClick={pauseTimer}
          />
        );

      case "PAUSED":
        return (
          <ButtonComponent
            text="Continuar"
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={resumeTimer}
          />
        );

      case "WAITING_BREAK":
        return (
          <ButtonComponent
            text="Iniciar pausa"
            variant="contained"
            startIcon={<CoffeeOutlined />}
            onClick={startBreak}
          />
        );

      case "FINISHED":
        return (
          <ButtonComponent
            text="Encerrar sessão"
            variant="contained"
            onClick={resetTimer}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 2,
        minWidth: 0,
      }}
    >
      <Typography variant="h6">Foco atual</Typography>

      <Typography sx={{ textAlign: "center" }}>
        {title}
      </Typography>

      <Typography
        component="output"
        aria-label="Tempo restante"
        sx={{
          textAlign: "center",
          fontSize: "3rem",
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatTimer(remainingSeconds)}
      </Typography>

      {isActive && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {statusLabel}
        </Typography>
      )}

      {renderPrimaryAction()}

      {showSecondaryActions && (
        <Stack spacing={1}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
          >
            <ButtonComponent
              text="Reiniciar"
              variant="outlined"
              startIcon={<RestartAlt />}
              onClick={restartTimer}
              sx={{ flex: 1 }}
            />

            <ButtonComponent
              text="Finalizar"
              variant="outlined"
              color="error"
              startIcon={<Stop />}
              onClick={finishTimer}
              sx={{ flex: 1 }}
            />
          </Stack>

          {isBreak && (
            <ButtonComponent
              text="Pular pausa"
              variant="text"
              onClick={skipBreak}
            />
          )}
        </Stack>
      )}

      <Divider />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textAlign: "center" }}
      >
        Uma tarefa de cada vez.
      </Typography>
    </Stack>
  );
};