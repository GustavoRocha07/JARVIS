
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type {
    CreateProjectInput,
    Project,
    ProjectId,
    UpdateProjectInput,
} from "../types/projects.types";

import { projectService } from "../services/project.service";
import { useProjectQuery } from "./useProjectsQuery";

export const useProjectData = () => {
    const queryClient = useQueryClient();

    const { projects } = useProjectQuery();

    const refreshProjects = useCallback(async (): Promise<void> => {
        await queryClient.invalidateQueries({
            queryKey: ["projects"],
        });
    }, [queryClient]);

    const createProject = useCallback(
        async (input: CreateProjectInput): Promise<Project> => {
            const created = await projectService.create(input);

            await refreshProjects();

            return created;
        },
        [refreshProjects]
    );

    const updateProject = useCallback(
        async (
            id: ProjectId,
            input: UpdateProjectInput
        ): Promise<Project> => {
            const updated = await projectService.update(id, input);

            await refreshProjects();

            return updated;
        },
        [refreshProjects]
    );

    const archiveProject = useCallback(
        async (id: ProjectId): Promise<Project> => {
            const archived = await projectService.archive(id);

            await refreshProjects();

            return archived;
        },
        [refreshProjects]
    );

    const restoreProject = useCallback(
        async (id: ProjectId): Promise<Project> => {
            const restored = await projectService.restore(id);

            await refreshProjects();

            return restored;
        },
        [refreshProjects]
    );

    return {
        projects,
        refreshProjects,
        createProject,
        updateProject,
        archiveProject,
        restoreProject,
    };
};
