import type { ProjectProgress } from "../types/projects.types";

export const calculateProgress = (total: number, completed: number): ProjectProgress => {

    if (!Number.isInteger(total) ||
        !Number.isInteger(completed) ||
        total < 0 ||
        completed < 0 ||
        completed > total
    ) {
        throw new Error('Contagens de tarefas inválidas.');
    }


    return {
        total,
        completed,
        pending: total - completed,
        percentage:
            total === 0 ? 0 : Math.round((completed / total) * 100),
    }
}