import type { CreateProjectInput, Project, ProjectId, UpdateProjectInput } from "../types/projects.types";
import { projectRepository } from "./projectRepository";

export const projectService = {
    getAll(): Project[] {
        return projectRepository.getAll();
    },

    getById(id: ProjectId): Project | null {
        return projectRepository.getById(id);
    },

    create(input: CreateProjectInput): Project {
        const now = new Date().toISOString();

        const project: Project = {
            id: crypto.randomUUID(),
            name: input.name.trim(),
            description: input.description.trim(),
            createdAt: now,
            updatedAt: now,
            archivedAt: null,
        };

        projectRepository.save(project);

        return project;
    },

    update(
        id: ProjectId,
        input: UpdateProjectInput,
    ): Project {
        const existing = projectRepository.getById(id);

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

        projectRepository.save(updated);

        return updated;
    },

    archive(id: ProjectId): Project {
        const existing = projectRepository.getById(id);

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

        projectRepository.save(archived);

        return archived;
    },

    restore(id: ProjectId): Project {
        const existing = projectRepository.getById(id);

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

        projectRepository.save(restored);

        return restored;
    },
};
