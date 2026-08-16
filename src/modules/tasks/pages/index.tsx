import { useMemo, useState } from "react";

import { AddOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";

import { HeaderComponent } from "@/shared/components/HeaderComponent";
import { TableComponent } from "@/shared/components/TableComponent";

import { TaskModal } from "../components/Modal/TaskModal";
import { TaskSummary } from "../components/TaskSummary/TaskSummary";

import { TasksProvider } from "../contexts/TasksProvider";
import { useTasksData } from "../contexts/useTasksData";
import { useTasksUI } from "../contexts/useTasksUI";



import type {
  Task,
  TaskSubmit,
} from "../types/tasks.type";
import { createTaskColumns } from "../hook/tasks.columns";

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
    handleOpenModal,
    handleCloseModal,
  } = useTasksUI();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const columns = useMemo(
    () =>
      createTaskColumns({
        onEdit: handleOpenModal,
        onDelete: handleDeleteTask,
      }),
    [handleOpenModal, handleDeleteTask]
  );

  const paginatedTasks = tasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

      <Box sx={{ mt: 3 }}>
        <TableComponent<Task>
          data={paginatedTasks}
          columns={columns}
          page={page}
          rowsPerPage={rowsPerPage}
          total={tasks.length}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
          getRowId={(row) => row.id}
        />
      </Box>

      {openModal && (
        <TaskModal
          open={openModal}
          onClose={handleCloseModal}
          title={
            selectedTask
              ? "Editar Tarefa"
              : "Cadastrar Tarefa"
          }
          initialData={selectedTask}
          onSubmit={handleSubmitTask}
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