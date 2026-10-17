import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material"
import type { Task } from "../../types/tasks.type";
import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import { formatTimer } from "@/modules/timer/utils/formatTimer";
import { OpenWithRounded, PauseOutlined, PlayArrow, PlayArrowOutlined, Refresh, Stop } from "@mui/icons-material";
import { useTimer } from "@/modules/timer/contexts/useTimer";
import type { TimerTarget } from "@/modules/timer/types/timer.type";

type TomatoComponentProps = {
    item: Task | SubTask;
    target: TimerTarget,
    ownsTaskTimer: boolean;
    onOpenTimer: (target: Task | SubTask) => void;
}

export const TomatoComponent = ({ target, ownsTaskTimer, onOpenTimer, item }: TomatoComponentProps) => {

    const {
        timer,
        startTimer,
        pauseTimer,
        resumeTimer,
        finishTimer,
        restartTimer
    } = useTimer();


    return (
        <Stack
            direction="row"
            spacing={0.75}
            onClick={(event) => event.stopPropagation()}
            sx={(theme) => (
                {
                    alignItems: "center",
                    minHeight: '5rem',
                    border: `1px solid  ${theme.palette.divider}`,
                    marginY: '1rem',
                    borderRadius: '1rem'
                }
            )}
        >

            {
                ownsTaskTimer ? (
                    <Box sx={{
                        width: '100%',
                        padding: '.6rem'
                    }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="caption" sx={{
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}>
                                POMODORO ATIVO
                            </Typography>
                            <Typography variant="caption" sx={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}>
                                {formatTimer(timer.remainingSeconds)}
                            </Typography>

                        </Box>
                        <Divider />
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            my: '1rem'
                        }}>
                            <Box>
                                <IconButton
                                    title="Finalizar"
                                    onClick={finishTimer}>
                                    <Stop />
                                </IconButton>

                                { }

                                {
                                    timer.status === 'RUNNING' ? (
                                        <IconButton
                                            title="Pausar"
                                            onClick={() => {
                                                pauseTimer()
                                            }}>
                                            <PauseOutlined />
                                        </IconButton>
                                    )
                                        : (
                                            <IconButton
                                                onClick={() => {
                                                    resumeTimer()
                                                }}>
                                                <PlayArrow />
                                            </IconButton>
                                        )
                                }
                                <IconButton
                                    onClick={restartTimer}>
                                    <Refresh />
                                </IconButton>
                            </Box>

                            <Button
                                sx={(theme) => ({
                                    background: '#8B5CF6',
                                    color: theme.palette.text.primary,

                                })}

                                onClick={() => onOpenTimer(item)}>

                                <OpenWithRounded sx={{
                                    fontSize: 15,
                                    mx: '0.5rem'
                                }} />
                                Focus Mode
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Button
                        onClick={() => startTimer(target)}
                        sx={(theme) => (
                            {
                                width: '100%',
                                padding: '1rem',
                                color: theme.palette.text.primary,
                                fontWeight: 'bold'
                            }
                        )}>
                        <PlayArrowOutlined />
                        Iniciar Pomodoro (25:00)
                    </Button>
                )
            }

        </Stack >
    )
}