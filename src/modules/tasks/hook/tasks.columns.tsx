
import type { TableColumn } from "@/shared/components/TableComponent";
import type { Task } from "../types/tasks.type";
import { Chip, IconButton } from "@mui/material";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";

type TaskColumnsProps = {
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
};


const statusLabels: Record<Task["status"], string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em andamento",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
};

const statusStyles: Record<
    Task["status"],
    {
        backgroundColor: string;
        color: string;
    }
> = {
    PENDING: {
        backgroundColor: "#FFF3CD",
        color: "#856404",
    },
    IN_PROGRESS: {
        backgroundColor: "#CCE5FF",
        color: "#004085",
    },
    COMPLETED: {
        backgroundColor: "#D4EDDA",
        color: "#155724",
    },
    CANCELLED: {
        backgroundColor: "#F8D7DA",
        color: "#721C24",
    },
};

const priorityLabels: Record<Task["priority"], string> = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    URGENT: "Urgente",
};

const prirityStyles: Record<
    Task["priority"],
    {
        backgroundColor: string;
        color: string;
    }
> = {
    HIGH: {
        backgroundColor: "#e4a909",
        color: "#fff",
    },
    LOW: {
        backgroundColor: "#6790bb",
        color: "#ffff",
    },
    MEDIUM: {
        backgroundColor: "#ffe600",
        color: "#7e7102",
    },
    URGENT: {
        backgroundColor: "#F8D7DA",
        color: "#721C24",
    },
};


const hasDisabled = (task: Task): boolean => {
    return task.status === 'CANCELLED' || task.status === 'COMPLETED'
}

export const createTaskColumns = ({
    onEdit,
    onDelete,
}: TaskColumnsProps): TableColumn<Task>[] => [
        {
            key: "title",
            label: "Título",
        },
        {
            key: "description",
            label: "Descrição",
        },
        {
            key: "status",
            label: "Status",
            render: (task: Task) => {

                return <Chip sx={statusStyles[task.status]} label={statusLabels[task.status]} />;
            },
        },
        {
            key: "priority",
            label: "Prioridade",
            render: (task: Task) => {

                return <Chip sx={prirityStyles[task.priority]} label={priorityLabels[task.priority]} />;
            },
        },
        {
            key: "dueDate",
            label: "Vencimento",
            render: (task: Task) => {
                if (!task.dueDate) {
                    return "-";
                }

                return new Date(task.dueDate).toLocaleDateString(
                    "pt-BR",
                );
            },
        },
        {
            key: "actions",
            label: "Ações",
            render: (task: Task) => (
                <>
                    <IconButton
                        disabled={hasDisabled(task)}
                        onClick={() => onEdit(task)}
                        sx={{
                            cursor: !hasDisabled(task) ? 'pointer' : 'no-drop'
                        }}
                    >
                        <EditOutlined />
                    </IconButton>

                    <IconButton
                        disabled={hasDisabled(task)}
                        sx={{
                            cursor: !hasDisabled(task) ? 'pointer' : 'no-drop'
                        }}
                        onClick={() => onDelete(task.id)}
                    >
                        <DeleteOutlined />
                    </IconButton>
                </>
            ),
        },
    ];