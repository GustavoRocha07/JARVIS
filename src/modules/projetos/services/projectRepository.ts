import type { CreateProjectInput, Project, ProjectId, UpdateProjectInput } from "../types/projects.types";


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
        return readProjects().find(
            (project) => project.id === id,
        ) ?? null;
    },

    create(input: CreateProjectInput): Project {
        const projects = readProjects();
        const now = new Date().toISOString();

        const project: Project = {
            id: crypto.randomUUID(),
            name: input.name.trim(),
            description: input.description.trim(),
            createdAt: now,
            updatedAt: now,
            archivedAt: null,
        };

        saveProjects([...projects, project]);

        return project;
    },

    update(
        id: ProjectId,
        input: UpdateProjectInput,
    ): Project {
        const projects = readProjects();
        const existing = projects.find(
            (project) => project.id === id,
        );

        if (!existing) {
            throw new Error('Projeto não encontrado.');
        }

        const updated: Project = {
            ...existing,
            ...(input.name !== undefined && {
                name: input.name.trim(),
            }),
            ...(input.description !== undefined && {
                description: input.description.trim(),
            }),
            updatedAt: new Date().toISOString(),
        };

        saveProjects(
            projects.map((project) =>
                project.id === id ? updated : project,
            ),
        );

        return updated;
    },

    archive(id: ProjectId): Project {
        const projects = readProjects();
        const existing = projects.find(
            (project) => project.id === id,
        );

        if (!existing) {
            throw new Error('Projeto não encontrado.');
        }

        if (existing.archivedAt !== null) {
            return existing;
        }

        const now = new Date().toISOString();

        const archived: Project = {
            ...existing,
            archivedAt: now,
            updatedAt: now,
        };

        saveProjects(
            projects.map((project) =>
                project.id === id ? archived : project,
            ),
        );

        return archived;
    },

    restore(id: ProjectId): Project {
        const projects = readProjects();
        const existing = projects.find(
            (project) => project.id === id,
        );

        if (!existing) {
            throw new Error('Projeto não encontrado.');
        }

        if (existing.archivedAt === null) {
            return existing;
        }

        const restored: Project = {
            ...existing,
            archivedAt: null,
            updatedAt: new Date().toISOString(),
        };

        saveProjects(
            projects.map((project) =>
                project.id === id ? restored : project,
            ),
        );

        return restored;
    },
};
