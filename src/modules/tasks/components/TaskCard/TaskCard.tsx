import { Box, Card, CardContent, Chip, Grid, LinearProgress, Typography } from "@mui/material"
import type { Task } from "../../types/tasks.type"
import { priorityLabels, statusStyles } from "@/shared/utils/getColorsAlert";
import { IconButton } from "@mui/material"
import ModeIcon from '@mui/icons-material/Mode';
import { DeleteRounded, Description } from "@mui/icons-material";


type TaskCardProps = {
    task: Task;
    onClick: (task: Task) => void;
    onEdit: (task: Task) => void;
    handleConfirmDeletedTask: (task: Task) => void
}

export const TaskCard = ({ task, onClick, onEdit, handleConfirmDeletedTask }: TaskCardProps) => {
    const totalSubtasks = task.subTasks?.length ?? 0;
    const completedSubtasks =
        task.subTasks?.filter((subtask) => subtask.completed).length ?? 0;

    const progress =
        totalSubtasks > 0
            ? (completedSubtasks / totalSubtasks) * 100
            : 0;
    return (
        <Card
            className="cardContainer"
            onClick={() => onClick(task)}
        >
            <CardContent>
                <Grid
                    size={12}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1
                    }}>
                    <Typography

                        variant="h6"
                        sx={{
                            marginRight: '1rem',
                            minWidth: '50%',
                            fontFamily: 'Roboto'
                        }}
                    >
                        {task.title}
                    </Typography>

                    <Chip size="small" sx={statusStyles[task.status]} label={priorityLabels[task.priority]} />

                    <Box
                        onClick={(event) => event.stopPropagation()}
                        sx={{
                            minWidth: '10%'

                        }}>

                        <IconButton
                            aria-label="Editar Tarefa"
                            title="Editar Tarefa"
                            onClick={() => onEdit(task)}
                        >
                            <ModeIcon />
                        </IconButton>
                        <IconButton
                            aria-label="Deletar Tarefa"
                            title="Deletar Tarefa"
                            onClick={() => handleConfirmDeletedTask(task)}
                        >
                            <DeleteRounded />
                        </IconButton>


                    </Box>

                </Grid>
                <Grid
                    size={12}
                    sx={{
                        display: 'flex'
                    }}
                >
                    <Description />
                    <Typography
                        variant="overline"

                        sx={{
                            marginLeft: '.5rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {task.description}
                    </Typography>
                </Grid>
                {totalSubtasks > 0 && (
                    <Grid
                        size={12}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            paddingLeft: '3rem',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {completedSubtasks}/{totalSubtasks} subtarefas
                        </Typography>

                        <Box
                            sx={{
                                width: '150px',
                            }}
                        >
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                            />
                        </Box>
                    </Grid>
                )}
            </CardContent>
        </Card>
    )
}