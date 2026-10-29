import { useState } from "react";
import { Add, DeleteOutlined, EditOutlined, PlayCircle, Search, VisibilityOutlined } from "@mui/icons-material";
import { Box, Button, Checkbox, Chip, IconButton, InputAdornment, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useTasksData } from "@/modules/tasks/contexts/useTasksData";
import { useTasksUI } from "@/modules/tasks/contexts/useTasksUI";
import { TaskModal } from "@/modules/tasks/components/Modal/TaskModal";
import type { Task, TaskStatus } from "@/modules/tasks/types/tasks.type";
import { useTimer } from "@/modules/timer/contexts/useTimer";
import { isTaskLockedByTimer } from "@/modules/timer/rules/timer-target.rules";
import { ActionsMenu } from "@/shared/components/ActionsMenu/ActionsMenu";
import { ConfirmationModal } from "@/shared/components/ConfirmModal/ConfirmationModal";
import { ProjectFocusTimer } from "./ProjectFocusTimer";

const statuses: Record<TaskStatus, { label: string; color: "default" | "info" | "success" | "error" }> = {
  PENDING: { label: "Pendente", color: "default" },
  IN_PROGRESS: { label: "Em andamento", color: "info" },
  COMPLETED: { label: "Concluída", color: "success" },
  CANCELLED: { label: "Cancelada", color: "error" },
};

export const TaskProjectComponent = ({ projectId }: { projectId: string }) => {
  const data = useTasksData();
  const ui = useTasksUI();
  const { timer, startTimer, resumeTimer } = useTimer();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const tasks = data.tasks.filter((task) => task.projectId === projectId);
  const filtered = tasks.filter((task) => task.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()) && (!status || task.status === status));
  const selectedTask = tasks.find((task) => task.id === selectedId) ?? tasks.find((task) => task.status === "IN_PROGRESS" || task.status === "PENDING");
  const focusTask = timer.target ? data.tasks.find((task) => task.id === timer.target?.taskId) : selectedTask;

  const play = (task: Task) => {
    setSelectedId(task.id);
    if (timer.target) {
      if (timer.target.type === "TASK" && timer.target.taskId === task.id && timer.status === "PAUSED") resumeTimer();
      return;
    }
    if (task.status === "COMPLETED" || task.status === "CANCELLED") return;
    if (task.status === "PENDING" && !data.handleUpdateTask({ ...task, status: "IN_PROGRESS" })) return;
    startTimer({ type: "TASK", taskId: task.id });
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 2.5fr) minmax(0, 1fr)" }, gap: 2, alignItems: "start" }}>
      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, minWidth: 0, overflow: "hidden" }}>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 1 }}>
            <Typography variant="h6">Tarefas do projeto</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => ui.handleOpenModal(undefined, "create")}>Nova tarefa</Button>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField size="small" fullWidth placeholder="Buscar tarefa..." value={search} onChange={(event) => setSearch(event.target.value)} slotProps={{ htmlInput: { "aria-label": "Buscar tarefa" }, input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }} />
            <TextField select size="small" label="Status" value={status} onChange={(event) => setStatus(event.target.value)} sx={{ minWidth: 160 }}>
              <MenuItem value="">Todos os status</MenuItem>
              {Object.entries(statuses).map(([value, item]) => <MenuItem key={value} value={value}>{item.label}</MenuItem>)}
            </TextField>
          </Stack>
        </Stack>
        <Box sx={{ overflowX: "auto" }}>
          {filtered.map((task) => {
            const locked = isTaskLockedByTimer(timer, task.id);
            const ownsTimer = timer.target?.type === "TASK" && timer.target.taskId === task.id;
            const playDisabled = task.status === "COMPLETED" || task.status === "CANCELLED" || (timer.target !== null && (!ownsTimer || timer.status !== "PAUSED"));
            return <Box key={task.id} sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, minWidth: 480, borderTop: 1, borderColor: "divider", bgcolor: ownsTimer ? "action.selected" : undefined }}>
              <Checkbox size="small" checked={task.status === "COMPLETED"} disabled={locked} slotProps={{ input: { "aria-label": `Concluir ${task.title}` } }} onChange={(_, checked) => data.handleUpdateTask({ ...task, status: checked ? "COMPLETED" : "PENDING" })} />
              <Button color="inherit" onClick={() => ui.handleOpenModal(task, "view")} sx={{ flex: 1, minWidth: 0, justifyContent: "flex-start", textTransform: "none", textAlign: "left" }}>{task.title}</Button>
              <Chip size="small" label={statuses[task.status].label} color={statuses[task.status].color} />
              <Tooltip title={playDisabled && timer.target ? "Controle a sessão atual no painel de foco" : "Iniciar ou retomar foco"}><span><IconButton aria-label={`Iniciar foco: ${task.title}`} disabled={playDisabled} onClick={() => play(task)}><PlayCircle fontSize="small" /></IconButton></span></Tooltip>
              <IconButton aria-label={`Editar ${task.title}`} onClick={() => ui.handleOpenModal(task, "edit")}><EditOutlined fontSize="small" /></IconButton>
              <ActionsMenu ariaLabel={`Ações de ${task.title}`} actions={[
                { label: "Ver detalhes", icon: <VisibilityOutlined />, onClick: () => ui.handleOpenModal(task, "view") },
                { label: "Excluir", icon: <DeleteOutlined />, disabled: locked, onClick: () => ui.handleConfirmDeletedTask(task) },
              ]} />
            </Box>;
          })}
        </Box>
        {!filtered.length && <Typography color="text.secondary" sx={{ px: 2, py: 3 }}>{tasks.length ? "Nenhuma tarefa corresponde aos filtros." : "Este projeto ainda não tem tarefas. Crie a primeira!"}</Typography>}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", p: 2 }}>Exibindo {filtered.length} de {tasks.length} tarefas</Typography>
      </Box>
      <ProjectFocusTimer task={focusTask} onStart={play} />
      {ui.openModal && <TaskModal open mode={ui.modalMode} title={ui.selectedTask?.title ?? "Nova tarefa"} initialData={ui.selectedTask} defaultProjectId={projectId} onClose={ui.handleCloseModal} onModeChange={ui.handleSetModalMode} onSubTaskComplete={data.handleSubTaskComplete} onSubmit={async (payload) => { if (await data.handleSubmitTask(payload)) ui.handleCloseModal(); }} />}
      {ui.openConfirmDeletedModal && <ConfirmationModal open title={`Excluir a tarefa ${ui.selectedTask?.title}?`} message="A tarefa, suas subtarefas e sessões de foco serão removidas." onCancel={ui.handleCloseConfirmDeletedModal} onConfirm={() => { if (ui.selectedTask) data.handleDeleteTask(ui.selectedTask.id); }} />}
    </Box>
  );
};
