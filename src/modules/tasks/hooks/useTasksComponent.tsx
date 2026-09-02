import { usePagination } from "@/shared/hooks/usePagination";
import { useTasksData } from "../contexts/useTasksData";
import { useTasksUI } from "../contexts/useTasksUI";
import type { Task, TaskSubmit, UpdateTask } from "../types/tasks.type";
import { useSearch } from "@/shared/hooks/useSearch";
import { useState } from "react";

export const useTasksComponent = () => {

    const [searchTerm, setSearchTerm] = useState("");

    const {
        tasks,
        handleSubmitTask,
        handleUpdateTask,
        handleDeleteTask,
        handleSubTaskComplete,
    } = useTasksData();

    const filteredTasks = useSearch({
        items: tasks,
        searchTerm,
        searchBy: ["title", "description", "status", "priority"],
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
        items: filteredTasks.filteredItems,
        perPage: 10,
    });

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

            searchTerm,
            setSearchTerm,
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
