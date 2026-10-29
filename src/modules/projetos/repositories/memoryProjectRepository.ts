import type { Project } from "../types/projects.types";
import type { ProjectRepository } from "./ProjectRepository";

export const createMemoryProjectRepository = (
    initialProjects: readonly Project[] = [],
): ProjectRepository => {
    const projects = new Map(initialProjects.map((project) => [project.id, { ...project }]));

    return {
        getAll: async () => Array.from(projects.values(), (project) => ({ ...project })),
        getById: async (id) => {
            const project = projects.get(id);
            return project ? { ...project } : null;
        },
        save: async (project) => {
            projects.set(project.id, { ...project });
        },
    };
};
