import { BreadcrumbComponent } from "@/shared/components/BreadCrumbComponent";
import { Container } from "@/shared/components/Container/Container"

import { useParams } from "react-router-dom";
import { useDetalhamentoProject } from "../hooks/useDetalhamentoProject";
import { Box, Chip, LinearProgress, Typography, } from "@mui/material";
import { Folder } from "@mui/icons-material";
import { ButtonComponent } from "@/shared/components/ButtonComponent";
import EditIcon from '@mui/icons-material/Edit';
import { TaskProjectComponent } from "../components/TaskProjectComponent";


import { TasksProvider } from "@/modules/tasks/contexts/TasksProvider";

import { getColorDeadLine, getStatusColor } from "../utils/statusColor";
import { ProjectModal } from "../components/ProjectModal";

import { calculateProjectDeadline } from "../utils/calculateDeadLine";
import { useMemo } from "react";


const DetalhamentoProjectContent = () => {

    const { projectId } = useParams<{ projectId: string }>();

    const { state, actions } = useDetalhamentoProject({ projectId: projectId ?? '' })

    const project = state.project

    const getProjectStatus = () => {
        if (!project) return "";

        if (project.archivedAt) return "Arquivado";

        if (project.tasks.length === 0) return "Sem tarefa";

        if (project.progress.completed === project.progress.total) {
            return "Completo";
        }

        if (project.tasks.some((t) => t.status === "IN_PROGRESS")) {
            return "Em Andamento";
        }

        return "Pendente";
    };

    const statusProject = getProjectStatus();

    const prazoRestante = useMemo(
        () => calculateProjectDeadline(project?.dueDate),
        [project?.dueDate]
    );
    return (
        <Container>
            <BreadcrumbComponent
                items={[
                    { label: "Projetos", to: "/projects" },
                    { label: project?.name ?? '' }
                ]}
            />
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                }}>
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            bgcolor: theme.palette.mode === 'dark' ? '#16345C' : '#E3F2FD',
                        })}
                    >
                        <Folder
                            sx={(theme) => ({
                                fontSize: 28,
                                color: theme.palette.mode === 'dark' ? '#64B5F6' : '#1976D2',
                            })}
                        />

                    </Box>
                    <Box sx={{
                        mx: '1rem',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="h5">
                            {project?.name}
                        </Typography>
                        <Typography variant="caption" sx={(theme) => (
                            {
                                fontStyle: 'italic',
                                fontSize: '1rem',
                                color: theme.palette.text.secondary
                            }
                        )}>
                            {project?.description}
                        </Typography>
                    </Box>

                </Box>
                <Box sx={{
                    minWidth: '30%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}>

                    <Chip
                        label={prazoRestante === null
                            ? "Sem prazo definido"
                            : prazoRestante < 0
                                ? `Atrasado há ${Math.abs(prazoRestante)} dias`
                                : prazoRestante === 0
                                    ? "Vence hoje"
                                    : `Faltam ${prazoRestante} dias`}
                        color={getColorDeadLine(prazoRestante)}
                        variant="outlined"
                    />

                    <Chip
                        label={statusProject}
                        color={getStatusColor(statusProject)}
                        size="small"
                        sx={{
                            padding: 2
                        }}
                    />
                    { }
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <ButtonComponent
                        sx={(theme) => ({
                            border: `1px solid ${theme.palette.text.primary}`,
                            color: theme.palette.text.primary
                        })}
                        variant="outlined"
                        text="Editar Projeto"
                        onClick={() => actions.handleOpenEditModal()}
                        startIcon={<EditIcon />}
                    />

                </Box>


            </Box>

            <Box
                sx={{
                    border: "1px solid",
                    borderColor: "text.primary",
                    p: { xs: 2, sm: 3, md: 4 },
                    my: 2,
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    flexWrap: "wrap",
                    alignItems: { xs: "stretch", md: "center" },
                    gap: { xs: 2, md: 3 },
                    minWidth: 0,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        color: "text.primary",
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                >
                    Progresso do Projeto
                </Typography>

                <Typography
                    sx={{
                        color: "text.primary",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                >
                    {project?.progress?.completed ?? 0} de{" "}
                    {project?.progress?.total ?? 0} tarefas concluídas
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: { xs: "100%", md: "auto" },
                        flex: { md: "1 1 240px" },
                        minWidth: 0,
                    }}
                >
                    <LinearProgress
                        variant="determinate"
                        value={project?.progress?.percentage ?? 0}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            height: { xs: 8, sm: 10 },
                            borderRadius: 4,

                        }}
                    />

                    <Typography
                        variant="body2"
                        sx={{
                            flexShrink: 0,
                            whiteSpace: "nowrap",
                            color: "text.primary",

                        }}
                    >
                        {project?.progress?.percentage ?? 0}%
                    </Typography>
                </Box>
            </Box>

            {project && <TaskProjectComponent key={project.id} projectId={project.id} />}

            <ProjectModal
                open={state.openModal}
                mode={'edit'}
                project={state.project}
                onClose={actions.handleCloseModal}
                onSubmit={actions.handleSubmit}
            />
        </Container>
    )
}

export const DetalhamentoProjectPage = () => (
    <TasksProvider><DetalhamentoProjectContent /></TasksProvider>
);
