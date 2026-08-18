import type { ReactNode } from "react";

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error'

export type AlertInfo = {
    open: boolean;
    severity: AlertSeverity;
    message: string | ReactNode;
}

export type AlertContextValue = {
    alert: AlertInfo;
    showAlert: (severity: AlertSeverity, message: string | ReactNode) => void;
    closeAlert: () => void;
};

