import { useTasksData } from "../contexts/useTasksData"


export const useTaskSumary = () => {
    const { summary } = useTasksData();

    const cards = [
        {
            label: "Total",
            value: summary.total,
            color: "#1976d2",
        },
        {
            label: "Pendentes",
            value: summary.pending,
            color: "#ed6c02",
        },
        {
            label: "Em andamento",
            value: summary.inProgress,
            color: "#0288d1",
        },
        {
            label: "Concluídas",
            value: summary.completed,
            color: "#2e7d32",
        },
    ]


    return {
        cards
    }

}