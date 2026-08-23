import { useState } from "react";

import { AddOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";

import { HeaderComponent } from "@/shared/components/HeaderComponent";
import { PaginationComponent } from "@/shared/components/Pagination";
import { ConfirmationModal } from "@/shared/components/ConfirmModal/ConfirmationModal";
import { EmptyCard } from "@/shared/components/EmptyCard/EmptyCard";

import { TaskModal } from "../components/Modal/TaskModal";
import { TaskSummary } from "../components/TaskSummary/TaskSummary";
import { TaskCard } from "../components/TaskCard/TaskCard";

import { TasksProvider } from "../contexts/TasksProvider";
import { useTasksData } from "../contexts/useTasksData";
import { useTasksUI } from "../contexts/useTasksUI";

import type {
  Task,
  TaskSubmit,
  UpdateTask,
} from "../types/tasks.type";

const ROWS_PER_PAGE = 10;

const TasksContent = () => {
  const {
    tasks,
    handleSubmitTask,
    handleUpdateTask,
    handleDeleteTask,
    handleSubTaskComplete,
  } = useTasksData();

  const {
    openModal,
    modalMode,
    selectedTask,
    openConfirmDeletedModal,
    handleOpenModal,
    handleSetModalMode,
    handleCloseModal,
    handleConfirmDeletedTask,
    handleCloseConfirmDeletedModal,
  } = useTasksUI();

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(
    tasks.length / ROWS_PER_PAGE,
  );

  const paginatedTasks = tasks.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  const handlePageChange = (
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleSubmit = (
    payload: TaskSubmit,
  ) => {
    const success =
      handleSubmitTask(payload);

    if (success) {
      handleCloseModal();
    }
  };

  const handleCompleteTask = (
    task: Task,
    completed: boolean,
  ) => {
    const data: UpdateTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: completed
        ? "COMPLETED"
        : "PENDING",
      dueDate: task.dueDate,
    };

    handleUpdateTask(data);
  };

  const handleConfirmDelete = () => {
    if (!selectedTask) {
      return;
    }

    handleDeleteTask(
      selectedTask.id,
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <HeaderComponent
        title="Tasks"
        subtitle="Gerenciamento de tarefas"
        hasButton
        buttonText="Cadastrar Tarefa"
        buttonIcon={<AddOutlined />}
        action={() =>
          handleOpenModal(
            undefined,
            "create",
          )
        }
      />

      <Box sx={{ mt: 3 }}>
        <TaskSummary />
      </Box>

      <Box
        sx={{
          mt: 3,
          minHeight: "50vh",
        }}
      >
        {paginatedTasks.map(
          (task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={(task) =>
                handleOpenModal(
                  task,
                  "view",
                )
              }
              onEdit={(task) =>
                handleOpenModal(
                  task,
                  "edit",
                )
              }
              onComplete={
                handleCompleteTask
              }
              onSubTaskComplete={
                handleSubTaskComplete
              }
              onDelete={
                handleConfirmDeletedTask
              }
            />
          ),
        )}

        {tasks.length === 0 && (
          <EmptyCard />
        )}
      </Box>

      {tasks.length > 0 &&
        totalPages > 1 && (
          <PaginationComponent
            page={page}
            count={totalPages}
            onPageChange={
              handlePageChange
            }
          />
        )}

      {openModal && (
        <TaskModal
          open={openModal}
          mode={modalMode}
          onClose={
            handleCloseModal
          }
          onModeChange={
            handleSetModalMode
          }
          onSubTaskComplete={
            handleSubTaskComplete
          }
          title={
            selectedTask
              ? selectedTask.title.toUpperCase()
              : "Cadastrar Tarefa"
          }
          initialData={
            selectedTask
          }
          onSubmit={
            handleSubmit
          }
        />
      )}

      {openConfirmDeletedModal && (
        <ConfirmationModal
          open={
            openConfirmDeletedModal
          }
          title={
            selectedTask
              ? `Tem certeza que deseja excluir a tarefa ${selectedTask.title}?`
              : "Excluir tarefa"
          }
          message={
            selectedTask?.description
          }
          onConfirm={
            handleConfirmDelete
          }
          onCancel={
            handleCloseConfirmDeletedModal
          }
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
