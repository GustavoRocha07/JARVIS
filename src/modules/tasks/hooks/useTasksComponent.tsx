import { usePagination } from "@/shared/hooks/usePagination";
import { useSearch } from "@/shared/hooks/useSearch";
import { useTasksData } from "../contexts/useTasksData";
import { useTasksUI } from "../contexts/useTasksUI";
import type { Task, TaskSubmit, UpdateTask } from "../types/tasks.type";

const TASK_SEARCH_FIELDS: readonly (keyof Task)[] = [
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
        filteredItems: filteredTasks,
    } = useSearch<Task>({
        items: tasks,
        searchBy: TASK_SEARCH_FIELDS,
    });

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
        items: filteredTasks,
        perPage: 10,
    });

    const timerParentTitle =
        selectedTimerTarget && "taskId" in selectedTimerTarget
            ? tasks.find(
                (task) => task.id === selectedTimerTarget.taskId,
            )?.title
            : undefined;

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        handlePageChange(1);
    };

    const handleSubmit = (payload: TaskSubmit) => {
        const success = handleSubmitTask(payload);

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

    return {
        state: {
            searchTerm,
            page,
            tasks,
            openModal,
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
        },
    };
};
