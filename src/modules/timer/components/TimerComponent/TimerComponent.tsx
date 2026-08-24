import type { SubTask } from "@/modules/subtasks/types/subtask.type";
import type { Task } from "@/modules/tasks/types/tasks.type";
import { ModalComponent } from "@/shared/components/ModalComponent"
import type { TimerState } from "../../types/timer.type";
import { Box } from "@mui/material";


type TimerComponentProps = {
    open: boolean;
    data: Task | SubTask;
    onCloseTimerModal: () => void;
    timer: TimerState
}

export const TimerComponent = ({ open, data, onCloseTimerModal, timer }: TimerComponentProps) => {

    return (
        <ModalComponent open={open} onClose={onCloseTimerModal} title="Teste">
            <Box>
                Ola
            </Box>
        </ModalComponent>
    )

}