import type { Task } from "@/modules/tasks/types/tasks.type"
import { HeaderComponent } from "@/shared/components/HeaderComponent"
import { Add } from "@mui/icons-material"
import { Box, } from "@mui/material"

type TaskProjectComponentProps = {
    tasks?: Task[]
}

export const TaskProjectComponent = ({ tasks }: TaskProjectComponentProps) => {
    return (
        <Box sx={(theme) => ({
            border: `1px solid ${theme.palette.text.secondary}`,
            minHeight: '10rem',
            borderRadius: 1,
            padding: 2
        })}>
            <HeaderComponent title="Tarefas do Projeto" variant="h6"
                action={() => console.log("Abrir Task")}
                buttonIcon={<Add />}
                hasButton
                buttonText=" Nova Tarefa"
            />

        </Box>
    )
}