import { useEffect } from "react";
import { usePagination } from "@/context/PaginationContext/usePagination";
import { useTasksData } from "../contexts/useTasksData";
import { useTasksUI } from "../contexts/useTasksUI";
import type { Task, TaskSubmit, UpdateTask } from "../types/tasks.type";

export const useTasksComponent = () => {
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
        perPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
        handlePageChange,
        setTotal,
    } = usePagination();

    useEffect(() => {
        setTotal(tasks.length);
    }, [tasks.length, setTotal]);

    const paginatedTasks = tasks.slice(
        (page - 1) * perPage,
        page * perPage,
    );

    const timerParentTitle =
        selectedTimerTarget && "taskId" in selectedTimerTarget
            ? tasks.find(
                (task) => task.id === selectedTimerTarget.taskId,
            )?.title
            : undefined;

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