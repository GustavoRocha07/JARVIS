import {
    Box,
    Card,
    CardContent,
    Checkbox,
    Chip,
    IconButton,
    LinearProgress,
    Typography,
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DescriptionIcon from '@mui/icons-material/Description';

import type { Task } from '../../types/tasks.type';

import {
    priorityLabels,
    statusStyles,
} from '@/shared/utils/getColorsAlert';

type TaskCardProps = {
    task: Task;
    onClick: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onComplete: (task: Task, completed: boolean) => void;
};

export const TaskCard = ({
    task,
    onClick,
    onEdit,
    onDelete,
    onComplete,
}: TaskCardProps) => {
    const subtasks = task.subTasks ?? [];

    const totalSubtasks = subtasks.length;

    const completedSubtasks = subtasks.filter(
        (subtask) => subtask.completed,
    ).length;

    const progress =
        totalSubtasks > 0
            ? (completedSubtasks / totalSubtasks) * 100
            : 0;

    const hasSubtasks = totalSubtasks > 0;

    const isCompleted = task.status === 'COMPLETED';

    const handleCompleteChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        event.stopPropagation();

        onComplete(task, event.target.checked);
    };

    const handleEdit = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation();

        onEdit(task);
    };

    const handleDelete = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation();

        onDelete(task);
    };

    return (
        <Card
            className="cardContainer"
            onClick={() => onClick(task)}
            sx={{
                cursor: 'pointer',
            }}
        >
            <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box
                    sx={{
                        width: '5%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                    }}
                >
                    <Checkbox
                        checked={isCompleted}
                        onChange={handleCompleteChange}
                        onClick={(event) => event.stopPropagation()}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                    />

                </Box>

                <Box
                    sx={{
                        width: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                fontFamily: 'Roboto',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {task.title}
                        </Typography>

                        <Chip
                            size="small"
                            sx={statusStyles[task.status]}
                            label={priorityLabels[task.priority]}
                        />


                    </Box>

                    {task.description && (
                        <Box
                            sx={{
                                width: '80%',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 0.5,
                            }}
                        >
                            <DescriptionIcon fontSize="small" />

                            <Typography
                                variant="body2"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {task.description}
                            </Typography>
                        </Box>
                    )}

                    {hasSubtasks && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                pl: 3,
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
                                    width: 150,
                                }}
                            >
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
                <Box
                    sx={{
                        width: '10%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <IconButton
                        aria-label="Editar tarefa"
                        title="Editar tarefa"
                        onClick={handleEdit}
                    >
                        <ModeIcon />
                    </IconButton>

                    <IconButton
                        aria-label="Deletar tarefa"
                        title="Deletar tarefa"
                        onClick={handleDelete}
                    >
                        <DeleteRoundedIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};