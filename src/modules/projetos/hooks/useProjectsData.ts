import { useCallback, useState } from "react"
import type { CreateProjectInput, Project, ProjectId, UpdateProjectInput } from "../types/projects.types"
import { projectService } from "../services/project.service"


export const useProjectData = () => {
    const [projects, setProjects] = useState<Project[]>(() => projectService.getAll());

    const refreshProjects = useCallback(() => {
        setProjects(projectService.getAll())
    }, []);

    const createProject = useCallback((input: CreateProjectInput): Project => {
        const created = projectService.create(input);

        refreshProjects();
        
        return created;
    }, [refreshProjects]);
    const updateProject = useCallback(
        (
            id: ProjectId,
            input: UpdateProjectInput,
        ): Project => {
            const updated = projectService.update(id, input);

            refreshProjects();

            return updated;
        },
        [refreshProjects],
    );

    const archiveProject = useCallback(
        (id: ProjectId): Project => {
            const archived = projectService.archive(id);

            refreshProjects();

            return archived;
        },
        [refreshProjects],
    );

    const restoreProject = useCallback(
        (id: ProjectId): Project => {
            const restored = projectService.restore(id);

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