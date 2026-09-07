import { AddOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";

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

const TasksContent = () => {
  const { state, actions } = useTasksComponent();

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 1.5, sm: 2, md: 2.5 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 28, md: 30 },
                lineHeight: 1.1,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Tasks
            </Typography>
            <Typography
              sx={{
                mt: 0.7,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Organize suas atividades e acompanhe seu progresso
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            startIcon={<AddOutlined sx={{ fontSize: 18 }} />}
            onClick={() => actions.handleOpenModal(undefined, "create")}
            sx={{
              minWidth: 132,
              height: 38,
              px: 1.8,
              borderRadius: "10px",
              textTransform: "none",
              fontSize: 13,
              fontWeight: 700,
              backgroundColor: "#0877b8",
              "&:hover": { backgroundColor: "#05689f" },
            }}
          >
            Nova tarefa
          </Button>
        </Box>

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
          />
        </Box>

        <Box sx={{ mt: 2.2, minHeight: "50vh" }}>
          {state.paginatedTasks.length > 0 && (
            <Grid container spacing={1.5} alignItems="stretch">
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
      </Box>

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
