import { Button, type ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

type ButtonComponentProps = ButtonProps & {
    text: string;
    buttonIcon?: ReactNode;
};

export const ButtonComponent = ({
    text,
    buttonIcon,
    startIcon,
    sx = [],
    ...props
}: ButtonComponentProps) => {
    return (
        <Button
            {...props}
            startIcon={startIcon ?? buttonIcon}
            sx={[
                {
                    padding: "1rem",
                    fontWeight: "bold",
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {text}
        </Button>
    );
};