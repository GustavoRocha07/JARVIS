
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";

import type {
    Project,
    ProjectProgress as ProjectProgressType,
} from "../types/projects.types";
import { ProjectProgress } from "./ProjectProgress";
import { ArrowForward, Delete, Edit, Folder } from "@mui/icons-material";
import { ButtonComponent } from "@/shared/components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { ActionsMenu } from "@/shared/components/ActionsMenu/ActionsMenu";


export type ProjectWithProgress = Project & {
    progress: ProjectProgressType;
};

type Props = {
    project: ProjectWithProgress;
    onEdit: (project: Project) => void;
    onView: (project: Project) => void;
    onArchive: (project: Project) => void;
    onRestore: (project: Project) => void;
};

export const ProjectCard = ({
    project,
    onEdit,
    onArchive,
    onRestore,
}: Props) => {
    const isArchived = project.archivedAt !== null;

    const navigate = useNavigate()
    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",

            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>

                    <Box sx={(theme) => ({
                        width: '3.5rem',
                        height: '3.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '.6rem',
                        mb: '1rem',
                        bgcolor: theme.palette.mode === 'dark' ? '#16345C' : '#E3F2FD',
                    })}>
                        <Folder sx={(theme) => (
                            {
                                fontSize: 40,
                                color: theme.palette.mode === 'dark' ? '#64B5F6' : '#1976D2',
                            }
                        )} />
                    </Box>
                    <ActionsMenu
                        actions={[
                            {
                                label: 'Editar',
                                onClick: () => onEdit(project),
                                icon: <Edit />
                            },
                            {
                                label: project.archivedAt ? 'Desarquivar Projeto' : 'Arquivar Projeto',
                                onClick: () => project.archivedAt ? onRestore(project) : onArchive(project),
                                icon: <Delete />
                            },
                        ]}
                    />
                </Box>


                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        mb: 2
                    }}
                >
                    <Typography variant="h6">
                        {project.name}
                    </Typography>

                    <Chip
                        label={isArchived ? "Arquivado" : "Ativo"}
                        color={isArchived ? "default" : "success"}
                        size="small"
                    />
                </Box>

                <Typography
                    variant="body2"
                    sx={(theme) => ({
                        overflowWrap: "anywhere",
                        color: theme.palette.text.secondary,
                        mb: 3
                    })}
                >
                    {project.description || "Sem descrição"}
                </Typography>

                <ProjectProgress progress={project.progress} />
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, display: 'flex', borderTop: '1px solid #cdcdcd' }}>
                <ButtonComponent
                    sx={(theme) => ({
                        width: '100%',
                        color: theme.palette.text.primary,
                        display: 'flex',
                        justifyContent: 'flex-start'
                    })}
                    variant="text"
                    text="Ver Projeto"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    endIcon={<ArrowForward />}
                />
            </CardActions>
        </Card>
    );
};
