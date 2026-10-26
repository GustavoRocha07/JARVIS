import type { Project, ProjectId } from "../types/projects.types";

const STORAGE_KEY = 'jarvis:projects';

const readProjects = (): Project[] => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
        throw new Error('Dados de projetos Inválidos!')
    }

    return parsed as Project[];
}

const saveProjects = (projects: Project[]): void => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects),
    );
};

export const projectRepository = {
    getAll(): Project[] {
        return readProjects();
    },

    getById(id: ProjectId): Project | null {
        return readProjects().find((project) => project.id === id) ?? null;
    },

    // Persiste o projeto pronto: insere um novo ID ou substitui o existente.
    save(project: Project): void {
        const projects = readProjects();
        const exists = projects.some((stored) => stored.id === project.id);

        saveProjects(
            exists
                ? projects.map((stored) => stored.id === project.id ? project : stored)
                : [...projects, project],
        );
    },
};
