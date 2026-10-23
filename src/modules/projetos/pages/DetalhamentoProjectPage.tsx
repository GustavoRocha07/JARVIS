import { BreadcrumbComponent } from "@/shared/components/BreadCrumbComponent";
import { Container } from "@/shared/components/Container/Container"

import { useParams } from "react-router-dom";
import { useDetalhamentoProject } from "../hooks/useDetalhamentoProject";
import { Box, Typography } from "@mui/material";
import { Folder } from "@mui/icons-material";
import { ButtonComponent } from "@/shared/components/ButtonComponent";
import EditIcon from '@mui/icons-material/Edit';
import { ActionsMenu } from "@/shared/components/ActionsMenu/ActionsMenu";


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
            {/* <ProjectProgress progress={} /> */}
        </Container>
    )
}