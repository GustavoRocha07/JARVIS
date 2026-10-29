import type { CreateProjectInput, Project, ProjectId, UpdateProjectInput } from "../types/projects.types";
import type { ProjectRepository } from "../repositories/ProjectRepository";

export const createProjectService = (repository: ProjectRepository) => ({
    getAll(): Promise<Project[]> {
        return repository.getAll();
    },

    getById(id: ProjectId): Promise<Project | null> {
        return repository.getById(id);
    },

    create(input: CreateProjectInput): Project {
        const now = new Date().toISOString();

        if (!input.name.trim()) {
            throw new Error('Nome do Projeto Obrigatório!');
        }

        const project: Project = {
            id: crypto.randomUUID(),
            name: input.name.trim(),
            description: input.description.trim(),
            createdAt: now,
            updatedAt: now,
            archivedAt: null,
        };

        repository.save(project);

        return project;
    },

    async update(
        id: ProjectId,
        input: UpdateProjectInput,
    ): Promise<Project> {
        const existing = await repository.getById(id);

        if (!existing) {
            throw new Error('Projeto não encontrado.');
        }

        const name = input.name?.trim();

        if (name !== undefined && !name) {
            throw new Error("Nome do projeto obrigatório!");
        }

        const updated: Project = {
            ...existing,
            ...(name !== undefined && { name }),
            ...(input.description !== undefined && {
                description: input.description.trim(),
            }),
            updatedAt: new Date().toISOString(),
        };

        repository.save(updated);

        return updated;
    },

    async archive(id: ProjectId): Promise<Project> {
        const existing = await repository.getById(id);

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

        repository.save(archived);

        return archived;
    },

    async restore(id: ProjectId): Promise<Project> {
        const existing = await repository.getById(id);

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

        repository.save(restored);

        return restored;
    },
});
