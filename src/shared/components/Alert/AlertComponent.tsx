import type { AlertInfo } from "@/types/Alert.type"
import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { getColorAlert } from "@/shared/utils/getColorsAlert";

type AlertComponentProps = AlertInfo & {
    onClose: () => void;
}

export const AlertComponent = ({ message, onClose, open, severity }: AlertComponentProps) => {

    return (
        <Snackbar open={open} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 5 }}>
            <Alert

                severity={severity}
                variant='filled'
                action={
                    <IconButton size='small' aria-label='close' color='inherit' onClick={onClose}>
                        <CloseIcon fontSize='small' />
                    </IconButton>
                }
                sx={{
                    top: '30px',
                    backgroundColor: '#fdf3e6',
                    border: `2px solid ${getColorAlert(severity)}`,
                    color: '#000',
                    '& .MuiAlert-icon': {
                        color: getColorAlert(severity),
                    },
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}