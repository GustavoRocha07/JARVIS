import { useEffect, useState } from "react";
import type { Project } from "../types/projects.types";
import { projectRepository } from "../services/projectRepository";
import { useAlert } from "@/context/AlertContext/useAlert";

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

    useEffect(() => {
        if (!projectId) return;

        let ativo = true;

        function carregarProjeto() {
            try {
                const project = projectRepository.getById(projectId);
                console.log(project)
                if (ativo) {
                    setResultado({
                        projectId,
                        project: project ?? null,
                    });
                }
            } catch (error) {
                if (!ativo) return;

                setResultado({ projectId, project: null });

                const mensagem =
                    error instanceof Error
                        ? error.message
                        : typeof error === "string"
                            ? error
                            : "Erro ao buscar projeto";

                showAlert("error", mensagem);
            }
        }

        void carregarProjeto();

        return () => {
            ativo = false;
        };
    }, [projectId, showAlert]);

    const project =
        resultado?.projectId === projectId ? resultado.project : null;




    return {
        state: { project },
        actions: {},
    };
};