import { Button, type ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

type ButtonComponentProps = ButtonProps & {
    text: string;
    buttonIcon?: ReactNode;
};

export const ButtonComponent = ({
    text,
    buttonIcon,
    ...props
}: ButtonComponentProps) => {
    return (
        <Button
            {...props}
            startIcon={buttonIcon}
            sx={{
                padding: '1rem',
                fontWeight: 'bold'
            }}
        >
            {text}
        </Button>
    );
};