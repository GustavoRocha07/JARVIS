import { Box, LinearProgress, Typography } from "@mui/material"
import type { ProjectProgress as ProjectProgressType } from "../types/projects.types";


type Props = {
    progress: ProjectProgressType
}

export const ProjectProgress = ({ progress }: Props) => {

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1
            }}>
                <Typography variant="body2">
                    Progresso
                </Typography>
                <Typography variant="body2" >
                    {progress.percentage}%
                </Typography>
            </Box>

            <LinearProgress
                variant="determinate"
                value={progress.percentage}
                sx={{ height: 8, borderRadius: 4 }}
            />

            <Typography
                variant="caption"
                sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    display: 'block',
                    mt: 1
                })}

            >
                {progress.completed} de {progress.total} tarefas
                concluídas
            </Typography>
        </Box>
    )
}