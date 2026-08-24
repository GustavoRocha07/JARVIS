import {
    CoffeeOutlined,
    InfoOutlined,
    Pause,
    PlayArrow,
    SkipNext,
    Stop,
    TaskAlt,
    TimerOutlined,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Chip,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";

import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "@/modules/tasks/types/tasks.type";
import { ModalComponent } from "@/shared/components/ModalComponent";

import { useTimer } from "../../contexts/useTimer";
import type {
    TimerPhase,
    TimerStatus,
    TimerTarget,
} from "../../types/timer.type";
import { formatTimer } from "../../utils/formatTimer";

type TimerComponentProps = {
    open: boolean;
    data: Task | SubTask;
    parentTitle?: string;
    onCloseTimerModal: () => void;
};

type TimerVisualState = {
    color: "error" | "warning" | "info" | "success";
    label: string;
};

const visualStates: Record<
    TimerPhase,
    Record<Exclude<TimerStatus, "IDLE">, TimerVisualState>
> = {
    FOCUS: {
        RUNNING: { color: "error", label: "Foco" },
        PAUSED: { color: "warning", label: "Pausado" },
        FINISHED: { color: "success", label: "Finalizado" },
    },
    BREAK: {
        RUNNING: { color: "info", label: "Pausa" },
        PAUSED: { color: "warning", label: "Pausa pausada" },
        FINISHED: { color: "success", label: "Finalizado" },
    },
};

const getTimerTarget = (data: Task | SubTask): TimerTarget => ({
    id: data.id,
    type: "taskId" in data ? "SUBTASK" : "TASK",
});

export const TimerComponent = ({
    open,
    data,
    parentTitle,
    onCloseTimerModal,
}: TimerComponentProps) => {
    const {
        timer,
        startTimer,
        pauseTimer,
        resumeTimer,
        skipBreak,
        finishTimer,
        resetTimer,
        isTimerOwner,
    } = useTimer();

    const target = getTimerTarget(data);
    const ownsTimer = isTimerOwner(target);
    const hasAnotherTimer = timer.target !== null && !ownsTimer;
    const isWaitingToStart = !ownsTimer;
    const isFinished = ownsTimer && timer.status === "FINISHED";
    const isBreak = ownsTimer && timer.phase === "BREAK";
    const remainingProgress = timer.duration > 0
        ? (timer.remainingSeconds / timer.duration) * 100
        : 0;

    const selectedActivityLabel = target.type === "TASK"
        ? "Tarefa"
        : parentTitle
            ? `Subtarefa de: ${parentTitle}`
            : "Subtarefa";

    const handleResetAndClose = () => {
        resetTimer();
        onCloseTimerModal();
    };

    const renderActions = () => {
        if (isWaitingToStart) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button color="inherit" onClick={onCloseTimerModal}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        disabled={hasAnotherTimer}
                        onClick={() => startTimer(target)}
                    >
                        Iniciar foco
                    </Button>
                </Stack>
            );
        }

        if (isFinished) {
            return (
                <Button
                    variant="contained"
                    startIcon={<TaskAlt />}
                    onClick={handleResetAndClose}
                >
                    Encerrar sessão
                </Button>
            );
        }

        return (
            <Stack direction="row" spacing={1}>
                {isBreak ? (
                    <Button
                        variant="outlined"
                        startIcon={<SkipNext />}
                        onClick={skipBreak}
                    >
                        Pular pausa
                    </Button>
                ) : timer.status === "RUNNING" ? (
                    <Button
                        variant="outlined"
                        startIcon={<Pause />}
                        onClick={pauseTimer}
                    >
                        Pausar
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        startIcon={<PlayArrow />}
                        onClick={resumeTimer}
                    >
                        Continuar
                    </Button>
                )}

                <Button
                    color="error"
                    variant="outlined"
                    startIcon={<Stop />}
                    onClick={finishTimer}
                >
                    Finalizar
                </Button>
            </Stack>
        );
    };

    const visualState = ownsTimer && timer.status !== "IDLE"
        ? visualStates[timer.phase][timer.status]
        : null;

    return (
        <ModalComponent
            open={open}
            onClose={onCloseTimerModal}
            title={isWaitingToStart ? "Iniciar foco" : "Tomato Timer"}
            actions={renderActions()}
        >
            {isWaitingToStart ? (
                <Stack spacing={2.5}>
                    <Typography variant="body2" color="text.secondary">
                        Você está prestes a iniciar uma sessão de foco.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "center",
                            p: 2,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <TimerOutlined color="primary" />
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="caption" color="text.secondary">
                                Atividade selecionada
                            </Typography>
                            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
                                {data.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {selectedActivityLabel}
                            </Typography>
                        </Box>
                    </Box>

                    <Alert severity="info" icon={<InfoOutlined />}>
                        Apenas uma sessão pode estar ativa por vez. Para iniciar
                        outra, finalize a sessão atual.
                    </Alert>

                    {hasAnotherTimer && (
                        <Alert severity="warning">
                            Já existe uma sessão ativa em outra tarefa ou subtarefa.
                        </Alert>
                    )}
                </Stack>
            ) : (
                <Stack spacing={3}>
                    <Stack
                        direction="row"
                        sx={{ alignItems: "center", justifyContent: "space-between" }}
                    >
                        <Chip
                            icon={isBreak ? <CoffeeOutlined /> : <TimerOutlined />}
                            label={visualState?.label}
                            color={visualState?.color}
                            variant="outlined"
                        />
                        <Typography
                            variant="caption"
                            color={isFinished ? "text.secondary" : "success.main"}
                            sx={{ fontWeight: 700 }}
                        >
                            {isFinished ? "Sessão encerrada" : "● Sessão ativa"}
                        </Typography>
                    </Stack>

                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {data.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {selectedActivityLabel}
                        </Typography>
                    </Box>

                    <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                        <Typography
                            variant="h2"
                            component="output"
                            aria-label="Tempo restante"
                            sx={{
                                fontVariantNumeric: "tabular-nums",
                                fontWeight: 700,
                            }}
                        >
                            {formatTimer(timer.remainingSeconds)}
                        </Typography>

                        <LinearProgress
                            color={visualState?.color}
                            variant="determinate"
                            value={remainingProgress}
                            sx={{ width: "100%", height: 7, borderRadius: 99 }}
                        />

                        <Stack
                            direction="row"
                            sx={{ width: "100%", justifyContent: "space-between" }}
                        >
                            <Typography variant="caption" color="text.secondary">
                                {isBreak ? "5min" : "25min"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                0min
                            </Typography>
                        </Stack>
                    </Stack>

                    {isFinished && (
                        <Alert severity="success">
                            Sessão finalizada com {formatTimer(timer.workedSeconds)} de foco.
                        </Alert>
                    )}
                </Stack>
            )}
        </ModalComponent>
    );
};
