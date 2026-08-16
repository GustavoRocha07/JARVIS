import { type Task, type CreateTask, type TasksParamsSearch, type UpdateTask, isTaskFromStorage } from "../types/tasks.type";

const STORAGE_KEY = 'tasksMap';


const getStoredTasks = (): Task[] => {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(rawData);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter(isTaskFromStorage)
            .map((task) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                dueDate: new Date(task.dueDate),
            }));
    } catch {

        return [];
    }
};

const saveTasks = (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const handleListTaskService = (params?: TasksParamsSearch): Task[] => {
    const tasks = getStoredTasks();
    if (!tasks.length) return [];
    if (!params || Object.keys(params).length === 0) return tasks;

    return tasks.filter((task) => {
        // 1. Busca por nome/título
        if (params.name?.trim()) {
            const query = params.name.trim().toLowerCase();
            const titleMatches = task.title.toLowerCase().includes(query);
            const descriptionMatches = task.description?.toLowerCase().includes(query) ?? false;
            if (!titleMatches && !descriptionMatches) return false;
        }

        // 2. Enumerações de status e prioridade
        if (params.priority && task.priority !== params.priority) return false;
        if (params.status && task.status !== params.status) return false;

        // 3. Comparação de data exata de vencimento (Formato YYYY-MM-DD)
        if (params.dueDate) {
            const taskDueDateIso = task.dueDate.toISOString().split('T')[0];
            const paramDueDateIso = new Date(params.dueDate).toISOString().split('T')[0];
            if (taskDueDateIso !== paramDueDateIso) return false;
        }

        // 4. Intervalo de datas de criação (createdAt)
        const createdTime = task.createdAt.getTime();

        if (params.startDate) {
            const startTime = new Date(params.startDate).getTime();
            if (!isNaN(startTime) && createdTime < startTime) return false;
        }

        if (params.endDate) {
            const endTime = new Date(params.endDate).getTime();
            if (!isNaN(endTime) && createdTime > endTime) return false;
        }

        return true;
    });
};

export const handleCreateTaskService = (newTaskData: CreateTask): Task => {
    const tasks = getStoredTasks();

    const newTask: Task = {
        ...newTaskData,
        id: Date.now(),
        createdAt: new Date(),
    };

    tasks.push(newTask);
    saveTasks(tasks);

    return newTask;
};

export const handleDeleteTaskService = (taskId: number): void => {
    const tasks = getStoredTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(updatedTasks);
};

export const handleUpdateTaskService = (taskId: number, updatedFields: UpdateTask): Task => {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
        throw new Error(`Tarefa com o ID ${taskId} não foi encontrada.`);
    }

    const currentTask = tasks[taskIndex];

    const updatedDueDate = updatedFields.dueDate
        ? new Date(updatedFields.dueDate)
        : currentTask.dueDate;

    const updatedTask: Task = {
        ...currentTask,
        ...updatedFields,
        dueDate: updatedDueDate,
    };

    tasks[taskIndex] = updatedTask;
    saveTasks(tasks);

    return updatedTask;
};