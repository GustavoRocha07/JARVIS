import type { Task } from "@/modules/tasks/types/tasks.type";
import type { AlertSeverity } from "@/types/Alert.type";


export const getColorAlert = (severity: AlertSeverity) => {
    switch (severity) {
        case 'error':
            return '#A6193C';
        case 'warning':
            return '#ed6c02';
        case 'info':
            return '#FFCB05';
        case 'success':
            return '#2e7d32';
        default:
            return '#000';
    }
}

export const statusLabels: Record<Task["status"], string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em andamento",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
};

export const statusStyles: Record<
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

export const priorityLabels: Record<Task["priority"], string> = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    URGENT: "Urgente",
};

export const prirityStyles: Record<
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