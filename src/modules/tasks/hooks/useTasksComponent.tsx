import { usePagination } from "@/shared/hooks/usePagination";
import { useSearch } from "@/shared/hooks/useSearch";

import { useTasksData } from "../contexts/useTasksData";
import { useTasksUI } from "../contexts/useTasksUI";
import { useTaskFilters } from "./useTaskFilters";
import type {
  TaskDueFilter,
  TaskPriorityFilter,
  TaskSort,
  TaskStatusFilter,
} from "./useTaskFilters";
import type { Task, TaskSubmit, UpdateTask } from "../types/tasks.type";

const TASK_SEARCH_FIELDS: Array<keyof Task> = [
  "title",
  "description",
  "status",
  "priority",
];

export const useTasksComponent = () => {
  const {
    tasks,
    handleSubmitTask,
    handleUpdateTask,
    handleDeleteTask,
    handleSubTaskComplete,
  } = useTasksData();

  const {
    searchTerm,
    setSearchTerm,
    filteredItems: searchedTasks,
  } = useSearch<Task>({
    items: tasks,
    searchBy: TASK_SEARCH_FIELDS,
  });

  const taskFilters = useTaskFilters({ items: searchedTasks });

  const {
    openModal,
    modalMode,
    selectedTask,
    selectedTimerTarget,
    openTimerModal,
    openConfirmDeletedModal,
    handleOpenModal,
    handleCloseModal,
    handleSetModalMode,
    handleOpenTimerModal,
    handleCloseTimerModal,
    handleConfirmDeletedTask,
    handleCloseConfirmDeletedModal,
  } = useTasksUI();

  const {
    page,
    totalPages,
    paginatedItems: paginatedTasks,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    handlePageChange,
  } = usePagination<Task>({
    items: taskFilters.filteredItems,
    perPage: 9,
  });

  const timerParentTitle =
    selectedTimerTarget && "taskId" in selectedTimerTarget
      ? tasks.find((task) => task.id === selectedTimerTarget.taskId)?.title
      : undefined;

  const resetPage = () => handlePageChange(1);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  const handleStatusFilterChange = (value: TaskStatusFilter) => {
    taskFilters.actions.setStatusFilter(value);
    resetPage();
  };

  const handlePriorityFilterChange = (value: TaskPriorityFilter) => {
    taskFilters.actions.setPriorityFilter(value);
    resetPage();
  };

  const handleDueFilterChange = (value: TaskDueFilter) => {
    taskFilters.actions.setDueFilter(value);
    resetPage();
  };

  const handleSortChange = (value: TaskSort) => {
    taskFilters.actions.setSort(value);
    resetPage();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    taskFilters.actions.clearFilters();
    resetPage();
  };

  const handleSubmit = (payload: TaskSubmit) => {
    const success = handleSubmitTask(payload);

    if (success) {
      handleCloseModal();
    }
  };

  const handleCompleteTask = (task: Task, completed: boolean) => {
    const data: UpdateTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: completed ? "COMPLETED" : "PENDING",
      dueDate: task.dueDate,
    };

    handleUpdateTask(data);
  };

  const handleConfirmDelete = () => {
    if (!selectedTask) return;

    handleDeleteTask(selectedTask.id);
    handleCloseConfirmDeletedModal();
  };

  const hasActiveFilters =
    Boolean(searchTerm.trim()) || taskFilters.state.hasActiveFilters;

  return {
    state: {
      page,
      tasks,
      openModal,
      searchTerm,
      modalMode,
      totalPages,
      hasNextPage,
      selectedTask,
      openTimerModal,
      paginatedTasks,
      timerParentTitle,
      hasPreviousPage,
      selectedTimerTarget,
      openConfirmDeletedModal,
      statusFilter: taskFilters.state.statusFilter,
      priorityFilter: taskFilters.state.priorityFilter,
      dueFilter: taskFilters.state.dueFilter,
      sort: taskFilters.state.sort,
      hasActiveFilters,
    },

    actions: {
      nextPage,
      previousPage,
      handleSubmit,
      handleOpenModal,
      handleCloseModal,
      handlePageChange,
      handleSearchChange,
      handleCompleteTask,
      handleSetModalMode,
      handleConfirmDelete,
      handleOpenTimerModal,
      handleSubTaskComplete,
      handleCloseTimerModal,
      handleConfirmDeletedTask,
      handleCloseConfirmDeletedModal,
      handleStatusFilterChange,
      handlePriorityFilterChange,
      handleDueFilterChange,
      handleSortChange,
      handleClearFilters,
    },
  };
};
