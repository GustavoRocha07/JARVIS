import { useState } from "react";

import { AddOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";

import { HeaderComponent } from "@/shared/components/HeaderComponent";
import { PaginationComponent } from "@/shared/components/Pagination";

import { TaskModal } from "../components/Modal/TaskModal";
import { TaskSummary } from "../components/TaskSummary/TaskSummary";
import { TaskCard } from "../components/TaskCard/TaskCard";

import { TasksProvider } from "../contexts/TasksProvider";
import { useTasksData } from "../contexts/useTasksData";
import { useTasksUI } from "../contexts/useTasksUI";

import type { TaskSubmit } from "../types/tasks.type";
import { ConfirmationModal } from "@/shared/components/ConfirmModal/ConfirmationModal";

const TasksContent = () => {
  const {
    tasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useTasksData();

  const {
    openModal,
    selectedTask,
    openConfirmDeletedModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirmDeletedTask,
    handleCloseConfirmDeletedModal,
  } = useTasksUI();

  const [page, setPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);

  const totalPages = Math.ceil(tasks.length / rowsPerPage);

  const paginatedTasks = tasks.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };



  const handleSubmitTask = (payload: TaskSubmit) => {
    if (payload.action === "CREATE") {
      handleCreateTask(payload.data);
    }

    if (payload.action === "UPDATE") {
      handleUpdateTask(payload.data);
    }

    handleCloseModal();
  };

  return (
    <Box sx={{ p: 3 }}>
      <HeaderComponent
        title="Tasks"
        subtitle="Gerenciamento de tarefas"
        hasButton
        buttonText="Cadastrar Tarefa"
        buttonIcon={<AddOutlined />}
        action={() => handleOpenModal()}
      />

      <Box sx={{ mt: 3 }}>
        <TaskSummary />
      </Box>

      <Box sx={{ mt: 3, minHeight: '50vh' }}>
        {paginatedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={(task) => console.log(task)}
            onEdit={handleOpenModal}
            handleConfirmDeletedTask={handleConfirmDeletedTask}
          />
        ))}
      </Box>

      {tasks.length > 0 && (
        <PaginationComponent
          page={page}
          count={totalPages}
         
          onPageChange={handlePageChange}


        />
      )}

      {openModal && (
        <TaskModal
          open={openModal}
          onClose={handleCloseModal}
          title={
            selectedTask
              ? selectedTask.title.toUpperCase()
              : "Cadastrar Tarefa"
          }
          initialData={selectedTask}
          onSubmit={handleSubmitTask}
        />
      )}

      {
        openConfirmDeletedModal && (
          <ConfirmationModal
            open={openConfirmDeletedModal}
            title={`Tem certeza que deseja excluir a tarefa ${selectedTask?.title}?`}
            onConfirm={() => handleDeleteTask(selectedTask?.id ?? 0)}
            onCancel={handleCloseConfirmDeletedModal}

            message={selectedTask?.description}
          />

        )
      }
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