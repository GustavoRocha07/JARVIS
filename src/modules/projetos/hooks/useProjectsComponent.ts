
import { useCallback, useMemo, useRef, useState } from "react";


import { useProjectData } from "./useProjectsData";
import { useProjectsUI } from "./useProjectsUI";

import { calculateProgress } from "../utils/calculateProjectProgress";

import type {
    CreateProjectInput,
    Project,
    UpdateProjectInput,
} from "../types/projects.types";
import { useProjectTasks } from "./useProjectTasks";
import { useAlert } from "@/context/AlertContext/useAlert";
import { useProjectQuery } from "./useProjectsQuery";

export const useProjectsComponent = () => {

    const { showAlert } = useAlert();
    const [isConfirming, setIsConfirming] = useState(false);
    const confirmingRef = useRef(false);

    // Dados dos projetos
    const {
        // projects,
        createProject,
        updateProject,
        archiveProject,
        restoreProject,
        refreshProjects,
    } = useProjectData();

    const {
        projects,
        isPending,
        isError,
        error,
    } = useProjectQuery();
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

        return projects?.map((project) => {
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

        return projectsWithProgress?.filter((project) => {
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
            active: projects?.filter(
                (project) => project.archivedAt === null,
            ).length,

            archived: projects?.filter(
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
        if (confirmingRef.current) return;
        confirmingRef.current = true;
        setIsConfirming(true);
        try {
            const project = uiState.projectToConfirm;
            const action = uiState.confirmAction;

            if (!project || !action) return;

            if (action === "archive") {
                await archiveProject(project.id);
                showAlert('success', 'Projeto arquivado com sucesso.');
            } else {
                await restoreProject(project.id);
                showAlert('success', 'Projeto restaurado com sucesso.');
            }

            uiActions.handleCloseConfirmModal();
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível concluir a operação!";

            showAlert("error", message);
        } finally {
            confirmingRef.current = false;
            setIsConfirming(false);
        }
    }, [uiState.projectToConfirm, uiState.confirmAction, archiveProject, restoreProject, showAlert, uiActions]);

    return {
        state: {
            ...uiState,
            isConfirming,
            projects: filteredProjects,
            allProjects: projectsWithProgress,
            projectCounts,

            hasProjects: (filteredProjects?.length ?? 0) > 0,

            isPending,
            isError,
            error,
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
