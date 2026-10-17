import { Box } from "@mui/material";
import type { ReactNode } from "react"


type ContainerProps = {
    children: ReactNode;
}
export const Container = ({ children }: ContainerProps) => {

    return (
        <Box
            sx={(theme) => ({
                width: "100%",
                maxWidth: 1180,
                mx: "auto",
                px: { xs: 1.5, sm: 2, md: 2.5 },
                py: { xs: 2, md: 3 },
                backgroundColor: theme.palette.background.default
            })}>
            {children}
        </Box>
    )

}