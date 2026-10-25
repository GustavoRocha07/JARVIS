import { useEffect, useMemo, useState } from "react";

import type { Project } from "../types/projects.types";
import { projectRepository } from "../services/projectRepository";
import { calculateProgress } from "../utils/calculateProjectProgress";

import { useAlert } from "@/context/AlertContext/useAlert";
import { useProjectTasks } from "./useProjectTasks";

type UseDetalhamentoProjectsProps = {
    projectId: string;
};

export const useDetalhamentoProject = ({
    projectId,
}: UseDetalhamentoProjectsProps) => {
    const [resultado, setResultado] = useState<{
        projectId: string;
        project: Project | null;
    } | null>(null);

    const { showAlert } = useAlert();
    const { tasks, refreshTasks } = useProjectTasks();

    useEffect(() => {
        if (!projectId) return;

        let ativo = true;

        function carregarProjeto() {
            try {
                const project = projectRepository.getById(projectId);

                if (ativo) {
                    setResultado({
                        projectId,
                        project: project ?? null,
                    });
                }
            } catch (error) {
                if (!ativo) return;

                setResultado({
                    projectId,
                    project: null,
                });

                const mensagem =
                    error instanceof Error
                        ? error.message
                        : typeof error === "string"
                            ? error
                            : "Erro ao buscar projeto";

                showAlert("error", mensagem);
            }
        }

        carregarProjeto();

        return () => {
            ativo = false;
        };
    }, [projectId, showAlert]);

    const project =
        resultado?.projectId === projectId
            ? resultado.project
            : null;

    const projectWithProgress = useMemo(() => {
        if (!project) return null;

        const projectTasks = tasks.filter(
            (task) => task.projectId === project.id,
        );

        const completedTasks = projectTasks.filter(
            (task) => task.status === "COMPLETED",
        );

        return {
            ...project,
            progress: calculateProgress(
                projectTasks.length,
                completedTasks.length,
            ),
        };
    }, [project, tasks]);

    return {
        state: {
            project: projectWithProgress,
        },
        actions: {
            refreshTasks,
        },
    };
};