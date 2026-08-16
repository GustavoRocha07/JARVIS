import {
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material"
import { useTasksData } from "../../contexts/useTasksData"


export const TaskSummary = () => {
    const { summary } = useTasksData()

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

    return (
        <Grid container spacing={2}>
            {cards.map((card) => (
                <Grid
                    key={card.label}
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <Card
                        sx={{
                            borderLeft: `5px solid ${card.color}`,
                        }}
                    >
                        <CardContent>
                            <Typography
                                color="textSecondary"
                                variant="subtitle2"
                                gutterBottom
                            >
                                {card.label}
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{ fontWeight: "bold" }}
                            >
                                {card.value}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}