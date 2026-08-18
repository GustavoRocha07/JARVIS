import { AlertComponent } from "@/shared/components/Alert/AlertComponent";
import { AlertContext } from "./AlertContext";
import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import type { AlertContextValue, AlertInfo } from "@/types/Alert.type";

export function AlertProvider({ children }: PropsWithChildren) {
    const [alert, setAlert] = useState<AlertInfo>({
        open: false,
        severity: 'success',
        message: ''
    });

    const showAlert = useCallback<AlertContextValue['showAlert']>((severity, message) => {
        setAlert({ open: true, severity, message })
    }, []);

    const closeAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    const value = useMemo(() => ({ alert, showAlert, closeAlert }), [alert, showAlert, closeAlert]);


    return (
        <AlertContext.Provider value={value} >
            {children}

            < AlertComponent
                open={alert.open}
                onClose={closeAlert}
                severity={alert.severity}
                message={alert.message}
            />
        </AlertContext.Provider>
    );
}
