import { AddOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { HeaderComponent } from "@/shared/components/HeaderComponent";
import { PaginationComponent } from "@/shared/components/Pagination";
import { ConfirmationModal } from "@/shared/components/ConfirmModal/ConfirmationModal";
import { EmptyCard } from "@/shared/components/EmptyCard/EmptyCard";

import { TaskModal } from "../components/Modal/TaskModal";
import { TaskSummary } from "../components/TaskSummary/TaskSummary";
import { TaskCard } from "../components/TaskCard/TaskCard";

import { TasksProvider } from "../contexts/TasksProvider";

import { TimerComponent } from "@/modules/timer/components/TimerComponent/TimerComponent";
import { useTasksComponent } from "../hooks/useTasksComponent";

const TasksContent = () => {
  const { state, actions } = useTasksComponent();

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <HeaderComponent
        title="Tasks"
        subtitle="Gerenciamento de tarefas"
        hasButton
        buttonText="Cadastrar Tarefa"
        buttonIcon={<AddOutlined />}
        action={() =>
          actions.handleOpenModal(
            undefined,
            "create",
          )
        }
      />

      <Box sx={{ mt: { xs: 2, md: 3 } }}>
        <TaskSummary />
      </Box>

      <Box
        sx={{
          mt: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <TextField
          value={state.searchTerm}
          onChange={(event) =>
            actions.handleSearchChange(event.target.value)
          }
          size="small"
          placeholder="Pesquisar tarefas..."
          aria-label="Pesquisar tarefas"
          sx={{
            width: { xs: "100%", md: 420 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          mt: { xs: 2, md: 3 },
          minHeight: "50vh",
          minWidth: 0,
        }}
      >
        {state.paginatedTasks.map(
          (task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={(task) =>
                actions.handleOpenModal(
                  task,
                  "view",
                )
              }
              onEdit={(task) =>
                actions.handleOpenModal(
                  task,
                  "edit",
                )
              }
              onComplete={
                actions.handleCompleteTask
              }
              onSubTaskComplete={
                actions.handleSubTaskComplete
              }
              onDelete={
                actions.handleConfirmDeletedTask
              }
              onOpenTimer={
                actions.handleOpenTimerModal
              }
            />
          ),
        )}

        {state.tasks.length === 0 && (
          <EmptyCard />
        )}

        {state.tasks.length > 0 &&
          state.paginatedTasks.length === 0 &&
          state.searchTerm.trim() && (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">
                Nenhuma tarefa encontrada para "{state.searchTerm}".
              </Typography>
            </Box>
          )}
      </Box>

      {state.tasks.length > 0 &&
        state.totalPages > 1 && (
          <PaginationComponent
            page={state.page}
            count={state.totalPages}
            onPageChange={
              actions.handlePageChange
            }
          />
        )}

      {state.openModal && (
        <TaskModal
          open={state.openModal}
          mode={state.modalMode}
          onClose={
            actions.handleCloseModal
          }
          onModeChange={
            actions.handleSetModalMode
          }
          onSubTaskComplete={
            actions.handleSubTaskComplete
          }
          title={
            state.selectedTask
              ? state.selectedTask.title.toUpperCase()
              : "Cadastrar Tarefa"
          }
          initialData={
            state.selectedTask
          }
          onSubmit={
            actions.handleSubmit
          }
        />
      )}

      {state.openConfirmDeletedModal && (
        <ConfirmationModal
          open={
            state.openConfirmDeletedModal
          }
          title={
            state.selectedTask
              ? `Tem certeza que deseja excluir a tarefa ${state.selectedTask.title}?`
              : "Excluir tarefa"
          }
          message={
            state.selectedTask?.description
          }
          onConfirm={
            actions.handleConfirmDelete
          }
          onCancel={
            actions.handleCloseConfirmDeletedModal
          }
        />
      )}

      {state.openTimerModal && state.selectedTimerTarget && (
        <TimerComponent
          open={state.openTimerModal}
          data={state.selectedTimerTarget}
          parentTitle={state.timerParentTitle}
          onCloseTimerModal={actions.handleCloseTimerModal}
        />
      )}
    </Box>
  );
};

export const TasksPage = () => {
  return (
    <TasksProvider>
      <TasksContent />
    </TasksProvider>
  );
};
