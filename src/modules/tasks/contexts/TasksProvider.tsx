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
    const [tasks, setTasks] = useState<Task[]>(() =>
        handleListTaskService({})
    );

    const [openModal, setOpenModal] = useState(false);
    const { showAlert } = useAlert();
    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);

    const [openConfirmDeletedModal, setOpenConfirmDeletedModal] = useState(false)

    const [filters, setFilters] =
        useState<TasksParamsSearch>({});

    /*
     * DADOS
     */

    const summary = useMemo(() => {
        return tasks.reduce(
            (acc, task) => {
                acc.total += 1;

                if (task.status === "PENDING") {
                    acc.pending += 1;
                }

                if (task.status === "IN_PROGRESS") {
                    acc.inProgress += 1;
                }

                if (task.status === "COMPLETED") {
                    acc.completed += 1;
                }

                return acc;
            },
            {
                total: 0,
                pending: 0,
                inProgress: 0,
                completed: 0,
            }
        );
    }, [tasks]);

    const handleCreateTask = useCallback(
        (newTask: CreateTask) => {
            try {
                handleCreateTaskService(newTask);

                setTasks(handleListTaskService(filters));
                showAlert('success', 'Task Criada com Sucesso!')

            } catch (error: unknown) {
                if (isApiError(error)) {
                    showAlert('error', error.message);
                    return;
                }

                if (error instanceof Error) {
                    showAlert('error', error.message);
                    return;
                }

                if (typeof error === 'string') {
                    showAlert('error', error);
                    return;
                }

                showAlert('error', 'Ocorreu um erro inesperado.');
            }
        },
        [filters, showAlert]
    );

    const handleUpdateTask = useCallback(
        (task: UpdateTask) => {

            try {
                handleUpdateTaskService(task.id, task,);

                setTasks(handleListTaskService(filters));
                showAlert('success', 'Task Atualizada com Sucesso!')
            } catch (error: unknown) {
                if (isApiError(error)) {
                    showAlert('error', error.message);
                    return;
                }

                if (error instanceof Error) {
                    showAlert('error', error.message);
                    return;
                }

                if (typeof error === 'string') {
                    showAlert('error', error);
                    return;
                }

                showAlert('error', 'Ocorreu um erro inesperado.');
            }

        },
        [filters, showAlert]
    );

    const handleConfirmDeletedTask = useCallback((task: Task) => {
        setSelectedTask(task)
        setOpenConfirmDeletedModal(true)
    }, [])


    const handleCloseConfirmDeletedModal = useCallback(() => {
        setOpenConfirmDeletedModal(false);
        setSelectedTask(null);
    }, []);

    const handleDeleteTask = useCallback(
        (taskId: number) => {
            try {
                handleDeleteTaskService(taskId);
                showAlert('success', 'Task Deletada  com Sucesso!')
                setTasks(handleListTaskService(filters));
                setOpenConfirmDeletedModal(false);
                setSelectedTask(null);
            } catch (error: unknown) {
                if (isApiError(error)) {
                    showAlert('error', error.message);
                    return;
                }

                if (error instanceof Error) {
                    showAlert('error', error.message);
                    return;
                }

                if (typeof error === 'string') {
                    showAlert('error', error);
                    return;
                }

                showAlert('error', 'Ocorreu um erro inesperado.');
            }
        },
        [filters, showAlert]
    );

    /*
     * UI
     */

    const handleOpenModal = useCallback((task?: Task) => {
        setSelectedTask(task ?? null);
        setOpenModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
        setSelectedTask(null);
    }, []);

    const handleSetFilters = useCallback(
        (newFilters: TasksParamsSearch) => {
            setFilters(newFilters);

            setTasks(
                handleListTaskService(newFilters)
            );
        },
        []
    );

    const handleClearFilters = useCallback(() => {
        setFilters({});
        setTasks(handleListTaskService({}));
    }, []);

    /*
     * CONTEXT VALUES
     */

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

        ]
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
            handleCloseConfirmDeletedModal
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
            handleCloseConfirmDeletedModal
        ]
    );



    return (
        <TasksDataContext.Provider value={dataValue}>
            <TasksUIContext.Provider value={uiValue}>
                {children}
            </TasksUIContext.Provider>
        </TasksDataContext.Provider>
    );
};