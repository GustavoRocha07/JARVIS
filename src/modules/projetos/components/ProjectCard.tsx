
import {
    Box,
    Button,
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
import { Folder } from "@mui/icons-material";



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
    onView,
    onArchive,
    onRestore,
}: Props) => {
    const isArchived = project.archivedAt !== null;

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
                        backgroundColor: theme.palette.mode === 'light' ? '#A78BFA' : '#8B5CF6'
                    })}>
                        <Folder sx={(theme) => (
                            {
                                fontSize: 40,
                                color: theme.palette.text.primary
                            }
                        )} />
                    </Box>

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

            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button onClick={() => onView(project)}>
                    Visualizar
                </Button>

                {!isArchived && (
                    <Button onClick={() => onEdit(project)}>
                        Editar
                    </Button>
                )}

                <Button
                    color={isArchived ? "success" : "warning"}
                    onClick={() =>
                        isArchived
                            ? onRestore(project)
                            : onArchive(project)
                    }
                >
                    {isArchived ? "Restaurar" : "Arquivar"}
                </Button>
            </CardActions>
        </Card>
    );
};
