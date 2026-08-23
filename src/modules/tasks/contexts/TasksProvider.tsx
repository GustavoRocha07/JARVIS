import {
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";

import { TasksDataContext } from "./TasksDataContext";
import { TasksUIContext } from "./TasksUIContext";

import type {
  CreateTask,
  Task,
  TasksParamsSearch,
  UpdateTask,
} from "../types/tasks.type";

import {
  handleCreateTaskService,
  handleDeleteTaskService,
  handleListTaskService,
  handleUpdateTaskService,
} from "../services/tasks.service";

import { useAlert } from "@/context/AlertContext/useAlert";

import { isApiError } from "../rules/isApiError";

export const TasksProvider = ({
  children,
}: PropsWithChildren) => {
  const { showAlert } = useAlert();

  const [tasks, setTasks] =
    useState<Task[]>(() =>
      handleListTaskService({}),
    );

  const [filters, setFilters] =
    useState<TasksParamsSearch>(
      {},
    );

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    selectedTask,
    setSelectedTask,
  ] = useState<Task | null>(
    null,
  );

  const [
    openConfirmDeletedModal,
    setOpenConfirmDeletedModal,
  ] = useState(false);

  const refreshTasks =
    useCallback(
      (
        params:
          TasksParamsSearch =
          filters,
      ) => {
        setTasks(
          handleListTaskService(
            params,
          ),
        );
      },
      [filters],
    );

  const handleError =
    useCallback(
      (error: unknown) => {
        if (isApiError(error)) {
          showAlert(
            "error",
            error.message,
          );

          return;
        }

        if (
          error instanceof Error
        ) {
          showAlert(
            "error",
            error.message,
          );

          return;
        }

        if (
          typeof error ===
          "string"
        ) {
          showAlert(
            "error",
            error,
          );

          return;
        }

        showAlert(
          "error",
          "Ocorreu um erro inesperado.",
        );
      },
      [showAlert],
    );

  const summary = useMemo(
    () =>
      tasks.reduce(
        (acc, task) => {
          acc.total += 1;

          if (
            task.status ===
            "PENDING"
          ) {
            acc.pending += 1;
          }

          if (
            task.status ===
            "IN_PROGRESS"
          ) {
            acc.inProgress += 1;
          }

          if (
            task.status ===
            "COMPLETED"
          ) {
            acc.completed += 1;
          }

          return acc;
        },
        {
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
        },
      ),
    [tasks],
  );

  const handleCreateTask =
    useCallback(
      (
        newTask: CreateTask,
      ): Task | null => {
        try {
          const createdTask =
            handleCreateTaskService(
              newTask,
            );

          refreshTasks();

          showAlert(
            "success",
            "Task criada com sucesso!",
          );

          return createdTask;
        } catch (
          error: unknown
        ) {
          handleError(error);

          return null;
        }
      },
      [
        refreshTasks,
        showAlert,
        handleError,
      ],
    );

  const handleUpdateTask =
    useCallback(
      (
        task: UpdateTask,
      ): Task | null => {
        try {
          const updatedTask =
            handleUpdateTaskService(
              task.id,
              task,
            );

          refreshTasks();

          showAlert(
            "success",
            "Task atualizada com sucesso!",
          );

          return updatedTask;
        } catch (
          error: unknown
        ) {
          handleError(error);

          return null;
        }
      },
      [
        refreshTasks,
        showAlert,
        handleError,
      ],
    );

  const handleDeleteTask =
    useCallback(
      (
        taskId: number,
      ): boolean => {
        try {
          handleDeleteTaskService(
            taskId,
          );

          refreshTasks();

          setOpenConfirmDeletedModal(
            false,
          );

          setSelectedTask(null);

          showAlert(
            "success",
            "Task deletada com sucesso!",
          );

          return true;
        } catch (
          error: unknown
        ) {
          handleError(error);

          return false;
        }
      },
      [
        refreshTasks,
        showAlert,
        handleError,
      ],
    );

  const handleConfirmDeletedTask =
    useCallback(
      (task: Task) => {
        setSelectedTask(task);

        setOpenConfirmDeletedModal(
          true,
        );
      },
      [],
    );

  const handleCloseConfirmDeletedModal =
    useCallback(() => {
      setOpenConfirmDeletedModal(
        false,
      );

      setSelectedTask(null);
    }, []);

  const handleOpenModal =
    useCallback(
      (task?: Task) => {
        setSelectedTask(
          task ?? null,
        );

        setOpenModal(true);
      },
      [],
    );

  const handleCloseModal =
    useCallback(() => {
      setOpenModal(false);

      setSelectedTask(null);
    }, []);

  const handleSetFilters =
    useCallback(
      (
        newFilters:
          TasksParamsSearch,
      ) => {
        setFilters(
          newFilters,
        );

        refreshTasks(
          newFilters,
        );
      },
      [refreshTasks],
    );

  const handleClearFilters =
    useCallback(() => {
      const emptyFilters:
        TasksParamsSearch = {};

      setFilters(
        emptyFilters,
      );

      refreshTasks(
        emptyFilters,
      );
    }, [refreshTasks]);

  const dataValue = useMemo(
    () => ({
      tasks,
      summary,

      handleCreateTask,
      handleUpdateTask,
      handleDeleteTask,
    }),
    [
      tasks,
      summary,
      handleCreateTask,
      handleUpdateTask,
      handleDeleteTask,
    ],
  );

  const uiValue = useMemo(
    () => ({
      filters,

      openModal,
      selectedTask,
      openConfirmDeletedModal,

      handleOpenModal,
      handleCloseModal,

      handleSetFilters,
      handleClearFilters,

      handleConfirmDeletedTask,
      handleCloseConfirmDeletedModal,
    }),
    [
      filters,
      openModal,
      selectedTask,
      openConfirmDeletedModal,

      handleOpenModal,
      handleCloseModal,

      handleSetFilters,
      handleClearFilters,

      handleConfirmDeletedTask,
      handleCloseConfirmDeletedModal,
    ],
  );

  return (
    <TasksDataContext.Provider
      value={dataValue}
    >
      <TasksUIContext.Provider
        value={uiValue}
      >
        {children}
      </TasksUIContext.Provider>
    </TasksDataContext.Provider>
  );
};