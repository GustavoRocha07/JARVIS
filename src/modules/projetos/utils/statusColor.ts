import type { ChipProps } from "@mui/material";

export const getStatusColor = (
    status: string
): ChipProps["color"] => {
    switch (status) {
        case "Sem tarefa":
            return "default";

        case "Em Andamento":
            return "info";

        case "Arquivado":
            return "warning";

        case "Completo":
            return "success";

        default:
            return "default";
    }
};


export const getColorDeadLine = (
    prazoRestante: number | null
): ChipProps["color"] => {
    if (prazoRestante === null) return "default";

    if (prazoRestante < 0) return "error";

    if (prazoRestante === 0) return "warning";

    return "info";
};