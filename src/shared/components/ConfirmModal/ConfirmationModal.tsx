

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import type { ReactNode } from "react";

interface ConfirmationModalProps {
    open: boolean;
    title: string;

    message?: string;
    children?: ReactNode;

    confirmText?: string;
    cancelText?: string;

    onConfirm: () => void;
    onCancel: () => void;

    loading?: boolean;
    disableConfirm?: boolean;
}

export const ConfirmationModal = ({
    open,
    title,
    message,
    children,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    loading = false,
    disableConfirm = false,
}: ConfirmationModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                {message && (
                    <Typography variant="body1">
                        {message}
                    </Typography>
                )}

                {children && (
                    <Box>
                        {children}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <Button
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading || disableConfirm}
                >
                    {loading ? "Aguarde..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};