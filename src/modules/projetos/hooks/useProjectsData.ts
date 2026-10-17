import { useCallback, useState } from "react"
import type { CreateProjectInput, Project, ProjectId, UpdateProjectInput } from "../types/projects.types"
import { projectRepository } from "../services/projectRepository"


export const useProjectData = () => {
    const [projects, setProjects] = useState<Project[]>(() => projectRepository.getAll());

    const refreshProjects = useCallback(() => {
        setProjects(projectRepository.getAll())
    }, []);

    const createProject = useCallback((input: CreateProjectInput): Project => {
        const created = projectRepository.create(input);

        refreshProjects();
        return created;
    }, [refreshProjects]);
    const updateProject = useCallback(
        (
            id: ProjectId,
            input: UpdateProjectInput,
        ): Project => {
            const updated = projectRepository.update(id, input);

            refreshProjects();

            return updated;
        },
        [refreshProjects],
    );

    const archiveProject = useCallback(
        (id: ProjectId): Project => {
            const archived = projectRepository.archive(id);

            refreshProjects();

            return archived;
        },
        [refreshProjects],
    );

    const restoreProject = useCallback(
        (id: ProjectId): Project => {
            const restored = projectRepository.restore(id);

            refreshProjects();

            return restored;
        },
        [refreshProjects],
    );

    return {
        projects,
        refreshProjects,
        createProject,
        updateProject,
        archiveProject,
        restoreProject,
    };
}