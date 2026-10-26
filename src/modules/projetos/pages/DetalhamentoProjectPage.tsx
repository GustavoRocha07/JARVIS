import { BreadcrumbComponent } from "@/shared/components/BreadCrumbComponent";
import { Container } from "@/shared/components/Container/Container"

import { useParams } from "react-router-dom";
import { useDetalhamentoProject } from "../hooks/useDetalhamentoProject";
import { Box, LinearProgress, Typography } from "@mui/material";
import { Folder } from "@mui/icons-material";
import { ButtonComponent } from "@/shared/components/ButtonComponent";
import EditIcon from '@mui/icons-material/Edit';
import { ActionsMenu } from "@/shared/components/ActionsMenu/ActionsMenu";
import { TaskProjectComponent } from "../components/TaskProjectComponent";


export const DetalhamentoProjectPage = () => {

    const { projectId } = useParams<{ projectId: string }>();

    const { state } = useDetalhamentoProject({ projectId: projectId ?? '' })

    const project = state.project

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

                        startIcon={<EditIcon />}
                    />
                    <Box sx={(theme) => ({
                        border: `1px solid ${theme.palette.text.primary}`,
                        color: theme.palette.text.primary,
                        width: 50,
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                        , ml: 4,
                        borderRadius: 1
                    })}>
                        <ActionsMenu actions={[
                            {
                                label: 'Editar Projeto',
                                icon: <EditIcon />,
                                onClick: () => console.log("ola")
                            }
                        ]} />

                    </Box>
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

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(0, 2.5fr) minmax(0, 1fr)",
                    },
                    gap: 2,
                    alignItems: "stretch",
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <TaskProjectComponent tasks={state.tasks} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    {/* Coloque seu componente de timer aqui */}
                </Box>
            </Box>

        </Container>
    )
}