import {
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material"
import { useTaskSumary } from "../../hooks/useTaskSummary"


export const TaskSummary = () => {


    const { cards } = useTaskSumary()

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