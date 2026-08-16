import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { ButtonComponent } from "../ButtonComponent";


type HeaderComponentProps = {
    title: string;
    subtitle?: string;
    hasButton?: boolean;
    buttonText?: string;
    buttonIcon?: ReactNode;
    action?: () => void;
}


export const HeaderComponent = ({ title, subtitle, buttonIcon, buttonText, hasButton, action }: HeaderComponentProps): React.JSX.Element => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }} >
            <Box>
                <Typography variant="h4" sx={{
                    fontWeight: 'bolder'
                }}>
                    {title}
                </Typography>

                {
                    subtitle && (
                        <Typography variant="h6" sx={{
                            fontWeight: 'normal',
                            fontStyle: 'italic'
                        }}>
                            {subtitle}
                        </Typography>
                    )
                }
            </Box>

            {
                hasButton && (
                    <ButtonComponent
                        variant="contained"
                        text={buttonText || ''}
                        buttonIcon={buttonIcon}
                        onClick={action}
                    />
                )
            }
        </Box>
    )
}