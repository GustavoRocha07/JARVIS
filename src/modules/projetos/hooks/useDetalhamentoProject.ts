import { useCallback, useEffect, useMemo, useState } from "react";

import type { Project, ProjectFormValues } from "../types/projects.types";
import { projectService } from "../services/project.service";
import { calculateProgress } from "../utils/calculateProjectProgress";

import { useAlert } from "@/context/AlertContext/useAlert";
import { useTasksData } from "@/modules/tasks/contexts/useTasksData";
import { useProjectData } from "./useProjectsData";

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

    const { updateProject } = useProjectData()
    const [openModal, setOpenModal] = useState(false);
    const { showAlert } = useAlert();
    const { tasks } = useTasksData();

    useEffect(() => {
        if (!projectId) return;

        let ativo = true;

        async function carregarProjeto() {
            try {
                const project = await projectService.getById(projectId);

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
            tasks: tasks,
            progress: calculateProgress(
                projectTasks.length,
                completedTasks.length,
            ),
        };
    }, [project, tasks]);

    const handleOpenEditModal = useCallback(() => {

        setOpenModal(true);
    }, []);


    const handleSubmit = useCallback(
        async (values: ProjectFormValues) => {
            try {
                const updated = await updateProject(projectId, values);

                if (!updated) {
                    throw new Error("Não foi possível atualizar o projeto!");
                }

                setResultado({
                    projectId,
                    project: updated,
                });

                setOpenModal(false);
                showAlert("success", "Projeto atualizado com sucesso!");

                return updated;
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível concluir a operação!";

                showAlert("error", message);
            }
        },
        [projectId, showAlert, updateProject]
    );


    return {
        state: {
            project: projectWithProgress,
            tasks,
            openModal
        },
        actions: {
            handleOpenEditModal,
            handleCloseModal: () => {
                setOpenModal(false)
            },
            handleSubmit
        }

    };
};
