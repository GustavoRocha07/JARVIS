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

export const TasksProvider = ({
    children,
}: PropsWithChildren) => {
    const [tasks, setTasks] = useState<Task[]>(() =>
        handleListTaskService({})
    );

    const [openModal, setOpenModal] = useState(false);

    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);

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
            handleCreateTaskService(newTask);

            setTasks(handleListTaskService(filters));
        },
        [filters]
    );

    const handleUpdateTask = useCallback(
        (task: UpdateTask) => {
            handleUpdateTaskService(task.id, task,);

            setTasks(handleListTaskService(filters));
        },
        [filters]
    );

    const handleDeleteTask = useCallback(
        (taskId: number) => {
            handleDeleteTaskService(taskId);

            setTasks(handleListTaskService(filters));
        },
        [filters]
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
            openModal,
            selectedTask,
            filters,
            handleOpenModal,
            handleCloseModal,
            handleSetFilters,
            handleClearFilters,
        }),
        [
            openModal,
            selectedTask,
            filters,
            handleOpenModal,
            handleCloseModal,
            handleSetFilters,
            handleClearFilters,
        ]
    );

    console.log("TasksProvider render");

    return (
        <TasksDataContext.Provider value={dataValue}>
            <TasksUIContext.Provider value={uiValue}>
                {children}
            </TasksUIContext.Provider>
        </TasksDataContext.Provider>
    );
};