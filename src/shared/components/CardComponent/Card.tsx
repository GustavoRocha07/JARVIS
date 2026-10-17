import { Paper } from "@mui/material"
import type { ReactNode } from "react"

type CardComponentProps = {
    children: ReactNode
}

export const CardComponent = ({ children }: CardComponentProps) => {

    return (
        <Paper
            elevation={0}
            sx={(theme) => ({
                minHeight: 62,
                px: 1.6,
                py: 1.25,
                border: theme.palette.background.paper,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.palette.secondary.contrastText,
            })}
        >
            {children}
        </Paper>
    )
}