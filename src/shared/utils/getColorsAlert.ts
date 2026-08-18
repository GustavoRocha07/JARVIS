import type { AlertSeverity } from "@/types/Alert.type";


export const getColorAlert = (severity: AlertSeverity) => {
    switch (severity) {
        case 'error':
            return '#A6193C';
        case 'warning':
            return '#ed6c02';
        case 'info':
            return '#FFCB05';
        case 'success':
            return '#2e7d32';
        default:
            return '#000';
    }
}