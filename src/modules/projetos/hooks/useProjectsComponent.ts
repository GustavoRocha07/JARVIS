
import { useCallback, useMemo } from "react";


import { useProjectData } from "./useProjectsData";
import { useProjectsUI } from "./useProjectsUI";

import { calculateProgress } from "../utils/calculateProjectProgress";

import type {
    CreateProjectInput,
    Project,
    UpdateProjectInput,
} from "../types/projects.types";
import { useProjectTasks } from "./useProjectTasks";

export const useProjectsComponent = () => {
    // Dados dos projetos
    const {
        projects,
        createProject,
        updateProject,
        archiveProject,
        restoreProject,
        refreshProjects,
    } = useProjectData();

    // Fonte única de tarefas
    const { tasks, refreshTasks } = useProjectTasks();

    // Estados da interface
    const {
        state: uiState,
        actions: uiActions,
    } = useProjectsUI();

    // Progresso derivado das tarefas
    const projectsWithProgress = useMemo(() => {
        const counts = new Map<
            string,
            { total: number; completed: number }
        >();

        tasks.forEach((task) => {
            if (!task.projectId) return;

            const current = counts.get(task.projectId) ?? {
                total: 0,
                completed: 0,
            };

            current.total++;

            if (task.status === "COMPLETED") {
                current.completed++;
            }

            counts.set(task.projectId, current);
        });

        return projects.map((project) => {
            const count = counts.get(project.id) ?? {
                total: 0,
                completed: 0,
            };

            return {
                ...project,
                progress: calculateProgress(
                    count.total,
                    count.completed
                ),
            };
        });
    }, [projects, tasks]);

    // Busca e filtro por aba
    const filteredProjects = useMemo(() => {
        const search = uiState.searchTerm
            .trim()
            .toLowerCase();

        return projectsWithProgress.filter((project) => {
            const matchesTab =
                uiState.activeTab === "active"
                    ? project.archivedAt === null
                    : project.archivedAt !== null;

            const matchesSearch =
                project.name.toLowerCase().includes(search) ||
                project.description.toLowerCase().includes(search);

            return matchesTab && matchesSearch;
        });
    }, [
        projectsWithProgress,
        uiState.searchTerm,
        uiState.activeTab,
    ]);

    // Indicadores para as abas
    const projectCounts = useMemo(() => {
        return {
            active: projects.filter(
                (project) => project.archivedAt === null,
            ).length,

            archived: projects.filter(
                (project) => project.archivedAt !== null,
            ).length,
        };
    }, [projects]);

    // Criar projeto
    const handleCreateProject = useCallback(
        async (input: CreateProjectInput): Promise<Project> => {
            const created = await createProject(input);

            uiActions.handleCloseModal();

            return created;
        },
        [createProject, uiActions],
    );

    // Atualizar projeto
    const handleUpdateProject = useCallback(
        async (
            id: Project["id"],
            input: UpdateProjectInput,
        ): Promise<Project> => {
            const updated = await updateProject(id, input);

            uiActions.handleCloseModal();

            return updated;
        },
        [updateProject, uiActions],
    );

    // Confirmar arquivamento ou restauração
    const handleConfirmAction = useCallback(async () => {
        const project = uiState.projectToConfirm;
        const action = uiState.confirmAction;

        if (!project || !action) return;

        if (action === "archive") {
            await archiveProject(project.id);
        } else {
            await restoreProject(project.id);
        }

        uiActions.handleCloseConfirmModal();
    }, [uiState.projectToConfirm, uiState.confirmAction, uiActions, archiveProject, restoreProject]);

    return {
        state: {
            ...uiState,

            projects: filteredProjects,
            allProjects: projectsWithProgress,
            projectCounts,

            hasProjects: filteredProjects.length > 0,
        },

        actions: {
            ...uiActions,

            handleCreateProject,
            handleUpdateProject,
            handleConfirmAction,
            refreshProjects,
            refreshTasks,
        },
    };
};
