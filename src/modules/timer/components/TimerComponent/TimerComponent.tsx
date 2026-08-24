import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "@/modules/tasks/types/tasks.type";
import { ModalComponent } from "@/shared/components/ModalComponent";
import { useTimer } from "../../contexts/useTimer";
import { formatTimer } from "../../utils/formatTimer";
import type { TimerStatus, TimerTarget } from "../../types/timer.type";
import {
    Alert,
    Box,
    Button,
    Chip,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";
import {
    Pause,
    PlayArrow,
    RestartAlt,
} from "@mui/icons-material";


type TimerComponentProps = {
    open: boolean;
    data: Task | SubTask;
    onCloseTimerModal: () => void;
};

const statusLabels: Record<TimerStatus, string> = {
    IDLE: "Pronto",
    RUNNING: "Em andamento",
    PAUSED: "Pausado",
    FINISHED: "Finalizado",
};

const getTimerTarget = (data: Task | SubTask): TimerTarget => ({
    id: data.id,
    type: "taskId" in data ? "SUBTASK" : "TASK",
});

export const TimerComponent = ({
    open,
    data,
    onCloseTimerModal,
}: TimerComponentProps) => {
    const {
        timer,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        isTimerOwner,
    } = useTimer();

    const target = getTimerTarget(data);
    const ownsTimer = isTimerOwner(target);
    const hasAnotherTimer = timer.target !== null && !ownsTimer;
    const progress = timer.duration > 0
        ? ((timer.duration - timer.remainingSeconds) / timer.duration) * 100
        : 0;

    const handlePrimaryAction = () => {
        if (!ownsTimer) {
            startTimer(target);
            return;
        }

        if (timer.status === "RUNNING") {
            pauseTimer();
            return;
        }

        if (timer.status === "PAUSED") {
            resumeTimer();
        }
    };

    const primaryLabel = ownsTimer && timer.status === "RUNNING"
        ? "Pausar"
        : ownsTimer && timer.status === "PAUSED"
            ? "Continuar"
            : "Iniciar foco";

    const primaryIcon = ownsTimer && timer.status === "RUNNING"
        ? <Pause />
        : <PlayArrow />;

    return (
        <ModalComponent
            open={open}
            onClose={onCloseTimerModal}
            title="Tomato Timer"
            actions={
                <Stack direction="row" spacing={1}>
                    {ownsTimer && timer.status !== "IDLE" && (
                        <Button
                            color="inherit"
                            startIcon={<RestartAlt />}
                            onClick={resetTimer}
                        >
                            Encerrar
                        </Button>
                    )}

                    {timer.status !== "FINISHED" && (
                        <Button
                            variant="contained"
                            startIcon={primaryIcon}
                            disabled={hasAnotherTimer}
                            onClick={handlePrimaryAction}
                        >
                            {primaryLabel}
                        </Button>
                    )}
                </Stack>
            }
        >
            <Stack spacing={3}>
                <Box>
                    <Typography variant="overline" color="text.secondary">
                        {target.type === "TASK" ? "Tarefa" : "Subtarefa"}
                    </Typography>
                    <Typography variant="h6">{data.title}</Typography>
                    {data.description && (
                        <Typography variant="body2" color="text.secondary">
                            {data.description}
                        </Typography>
                    )}
                </Box>

                {hasAnotherTimer && (
                    <Alert severity="warning">
                        Já existe outro timer ativo. Encerre-o antes de iniciar este.
                    </Alert>
                )}

                <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                    <Chip
                        size="small"
                        label={ownsTimer ? statusLabels[timer.status] : statusLabels.IDLE}
                        color={ownsTimer && timer.status === "RUNNING" ? "success" : "default"}
                    />
                    <Typography
                        variant="h2"
                        component="output"
                        aria-label="Tempo restante"
                        sx={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}
                    >
                        {formatTimer(ownsTimer ? timer.remainingSeconds : timer.duration)}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={ownsTimer ? progress : 0}
                        sx={{ width: "100%", height: 8, borderRadius: 99 }}
                    />
                </Stack>

                {ownsTimer && timer.status === "FINISHED" && (
                    <Alert severity="success">
                        Ciclo de foco concluído. Encerre para liberar o próximo timer.
                    </Alert>
                )}
            </Stack>
        </ModalComponent>
    );
};
