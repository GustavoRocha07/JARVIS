import { AddOutlined } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";

import { PaginationComponent } from "@/shared/components/Pagination";
import { ConfirmationModal } from "@/shared/components/ConfirmModal/ConfirmationModal";
import { EmptyCard } from "@/shared/components/EmptyCard/EmptyCard";

import { TaskModal } from "../components/Modal/TaskModal";
import { TaskSummary } from "../components/TaskSummary/TaskSummary";
import { TaskCard } from "../components/TaskCard/TaskCard";
import { TaskFilters } from "../components/TaskFilters/TaskFilters";

import { TasksProvider } from "../contexts/TasksProvider";

import { TimerComponent } from "@/modules/timer/components/TimerComponent/TimerComponent";
import { useTasksComponent } from "../hooks/useTasksComponent";
import { Container } from "@/shared/components/Container/Container";
import { HeaderComponent } from "@/shared/components/HeaderComponent";

const TasksContent = () => {
  const { state, actions } = useTasksComponent();

  return (
    <Container>

      <HeaderComponent
        title="Tarefas"
        subtitle="Organize suas atividades e acompanhe seu progresso"
        action={() => actions.handleOpenModal(undefined, "create")}
        buttonIcon={<AddOutlined sx={{ fontSize: 18 }} />}
        hasButton
        buttonText="Nova tarefa"
      />

      <Box sx={{ mt: 2.5 }}>
        <TaskSummary />
      </Box>

      <Box sx={{ mt: 2.2 }}>
        <TaskFilters

          searchTerm={state.searchTerm}
          statusFilter={state.statusFilter}
          priorityFilter={state.priorityFilter}
          dueFilter={state.dueFilter}
          sort={state.sort}
          hasActiveFilters={state.hasActiveFilters}
          onSearchChange={actions.handleSearchChange}
          onStatusChange={actions.handleStatusFilterChange}
          onPriorityChange={actions.handlePriorityFilterChange}
          onDueChange={actions.handleDueFilterChange}
          onSortChange={actions.handleSortChange}
          onClear={actions.handleClearFilters}
          showCompleted={state.showCompleted}
          handleShowCompletedChange={actions.handleShowCompletedChange}
        />
      </Box>

      <Box sx={{ mt: 2.2, minHeight: "50vh" }}>
        {state.paginatedTasks.length > 0 && (
          <Grid container spacing={1.5} sx={{ alignItems: "stretch" }}>
            {state.paginatedTasks.map((task) => (
              <Grid key={task.id} size={{ xs: 12, md: 4 }}>
                <TaskCard
                  task={task}
                  onClick={(selectedTask) =>
                    actions.handleOpenModal(selectedTask, "view")
                  }
                  onEdit={(selectedTask) =>
                    actions.handleOpenModal(selectedTask, "edit")
                  }
                  onComplete={actions.handleCompleteTask}
                  onSubTaskComplete={actions.handleSubTaskComplete}
                  onDelete={actions.handleConfirmDeletedTask}
                  onOpenTimer={actions.handleOpenTimerModal}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {state.tasks.length === 0 && <EmptyCard />}

        {state.tasks.length > 0 && state.paginatedTasks.length === 0 && (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              border: "1px dashed #dce2e8",
              borderRadius: "14px",
              backgroundColor: "#fff",
            }}
          >
            <Typography sx={{ fontSize: 14, color: "#64748b" }}>
              Nenhuma tarefa encontrada com os filtros selecionados.
            </Typography>
          </Box>
        )}
      </Box>

      {state.tasks.length > 0 && state.totalPages > 1 && (
        <Box sx={{ mt: 2 }}>
          <PaginationComponent
            page={state.page}
            count={state.totalPages}
            onPageChange={actions.handlePageChange}
          />
        </Box>
      )}


      {state.openModal && (
        <TaskModal
          open={state.openModal}
          mode={state.modalMode}
          onClose={actions.handleCloseModal}
          onModeChange={actions.handleSetModalMode}
          onSubTaskComplete={actions.handleSubTaskComplete}
          title={
            state.selectedTask
              ? state.selectedTask.title.toUpperCase()
              : "Cadastrar Tarefa"
          }
          initialData={state.selectedTask}
          onSubmit={actions.handleSubmit}
        />
      )}

      {state.openConfirmDeletedModal && (
        <ConfirmationModal
          open={state.openConfirmDeletedModal}
          title={
            state.selectedTask
              ? `Tem certeza que deseja excluir a tarefa ${state.selectedTask.title}?`
              : "Excluir tarefa"
          }
          message={state.selectedTask?.description}
          onConfirm={actions.handleConfirmDelete}
          onCancel={actions.handleCloseConfirmDeletedModal}
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
    </Container>
  );
};

export const TasksPage = () => {
  return (
    <TasksProvider>
      <TasksContent />
    </TasksProvider>
  );
};
