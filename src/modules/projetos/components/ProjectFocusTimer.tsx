import { CoffeeOutlined, Pause, PlayArrow, RestartAlt, Stop } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useTimer } from "@/modules/timer/contexts/useTimer";
import { FOCUS_DURATION_SECONDS } from "@/modules/timer/constants/timer.constants";
import { formatTimer } from "@/modules/timer/utils/formatTimer";
import type { Task } from "@/modules/tasks/types/tasks.type";

export const ProjectFocusTimer = ({ task, onStart }: { task?: Task; onStart: (task: Task) => void }) => {
  const { timer, pauseTimer, resumeTimer, restartTimer, startBreak, skipBreak, finishTimer, resetTimer } = useTimer();
  const active = timer.target !== null;
  const canStart = task && task.status !== "COMPLETED" && task.status !== "CANCELLED";
  const title = timer.target?.type === "SUBTASK"
    ? task?.subTasks?.find((item) => item.id === (timer.target?.type === "SUBTASK" ? timer.target.subTaskId : null))?.title
    : task?.title;

  return (
    <Stack spacing={2} sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2, minWidth: 0 }}>
      <Typography variant="h6">Foco atual</Typography>
      <Typography sx={{ textAlign: "center" }}>{title ?? (active ? "Sessão de foco ativa" : "Selecione uma tarefa para focar")}</Typography>
      <Typography component="output" aria-label="Tempo restante" sx={{ textAlign: "center", fontSize: "3rem", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {formatTimer(active ? timer.remainingSeconds : FOCUS_DURATION_SECONDS)}
      </Typography>
      {active && <Typography variant="caption" sx={{ textAlign: "center" }} color="text.secondary">
        {timer.status === "FINISHED" ? "Sessão finalizada" : timer.status === "WAITING_BREAK" ? "Foco concluído" : `${timer.phase === "BREAK" ? "Pausa" : "Foco"}${timer.status === "PAUSED" ? " pausado" : ""}`}
      </Typography>}
      {!active && <Button variant="contained" startIcon={<PlayArrow />} disabled={!canStart} onClick={() => task && onStart(task)}>Iniciar foco</Button>}
      {active && timer.status === "RUNNING" && <Button variant="contained" startIcon={<Pause />} onClick={pauseTimer}>Pausar</Button>}
      {active && timer.status === "PAUSED" && <Button variant="contained" startIcon={<PlayArrow />} onClick={resumeTimer}>Continuar</Button>}
      {active && timer.status === "WAITING_BREAK" && <Button variant="contained" startIcon={<CoffeeOutlined />} onClick={startBreak}>Iniciar pausa</Button>}
      {active && timer.status === "FINISHED" && <Button variant="contained" onClick={resetTimer}>Encerrar sessão</Button>}
      {active && timer.status !== "FINISHED" && <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button size="small" startIcon={<RestartAlt />} onClick={restartTimer}>Reiniciar</Button>
        {timer.phase === "BREAK" && <Button size="small" onClick={skipBreak}>Pular pausa</Button>}
        <Button size="small" color="error" startIcon={<Stop />} onClick={finishTimer}>Finalizar</Button>
      </Box>}
      <Divider />
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>Uma tarefa de cada vez.</Typography>
    </Stack>
  );
};
