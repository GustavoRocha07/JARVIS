import { useCallback, useEffect, useRef, useState } from "react";
import type { CreateProjectInput, Project, ProjectId, UpdateProjectInput } from "../types/projects.types";
import { projectService } from "../services/project.service";
import { useAlert } from "@/context/AlertContext/useAlert";

export const useProjectData = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const requestId = useRef(0);
    const { showAlert } = useAlert();

    const refreshProjects = useCallback(async (): Promise<void> => {
        const current = ++requestId.current;
        const projects = await projectService.getAll();
        if (current === requestId.current) setProjects(projects);
    }, []);

    const invalidateRequests = useCallback(() => { requestId.current++; }, []);

    useEffect(() => {
        let active = true;
        refreshProjects().catch((error: unknown) => {
            if (active) showAlert("error", error instanceof Error ? error.message : "Erro ao carregar projetos.");
        });
        return () => { active = false; invalidateRequests(); };
    }, [refreshProjects, showAlert, invalidateRequests]);

    const createProject = useCallback(async (input: CreateProjectInput): Promise<Project> => {
        const created = await projectService.create(input);
        await refreshProjects();
        return created;
    }, [refreshProjects]);

    const updateProject = useCallback(async (id: ProjectId, input: UpdateProjectInput): Promise<Project> => {
        const updated = await projectService.update(id, input);
        await refreshProjects();
        return updated;
    }, [refreshProjects]);

    const archiveProject = useCallback(async (id: ProjectId): Promise<Project> => {
        const archived = await projectService.archive(id);
        await refreshProjects();
        return archived;
    }, [refreshProjects]);

    const restoreProject = useCallback(async (id: ProjectId): Promise<Project> => {
        const restored = await projectService.restore(id);
        await refreshProjects();
        return restored;
    }, [refreshProjects]);

    return { projects, refreshProjects, createProject, updateProject, archiveProject, restoreProject };
};
